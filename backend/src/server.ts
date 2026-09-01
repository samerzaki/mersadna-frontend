import crypto from 'node:crypto';
import argon2 from 'argon2';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { MarketKind, TokenKind } from './generated/prisma/client.js';
import { z } from 'zod';
import { config } from './config.js';
import { prisma } from './db.js';
import { authenticate, clearSession, digest, fail, ok, setSession, token } from './http.js';
import { decimal, latest } from './market.js';

const app = Fastify({ logger: { redact: ['req.headers.cookie', 'req.headers.authorization'] }, bodyLimit: 1024 * 1024, trustProxy: true });
await app.register(cookie, { secret: config.SESSION_SECRET, hook: 'onRequest' });
await app.register(helmet, { contentSecurityPolicy: config.NODE_ENV === 'production' });
await app.register(cors, { origin: config.corsAllowedOrigins, credentials: true });
await app.register(rateLimit, { global: true, max: 300, timeWindow: '1 minute' });

app.addHook('onRequest', async (request, reply) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) || request.url.startsWith('/api/auth/')) return;
  const origin = request.headers.origin;
  const csrf = request.headers['x-csrf-token'];
  if ((origin && !config.corsAllowedOrigins.includes(origin)) || !csrf || csrf !== request.cookies.gold_csrf) return fail(reply, 403, 'Invalid CSRF token', 'CSRF_FAILED');
});
app.addHook('onSend', async (_request, reply, payload) => {
  if (!reply.getHeader('content-type')) reply.type('application/json; charset=utf-8');
  return payload;
});

const publicUser = (user: { id: number; email: string; firstName: string; lastName: string; avatarPath: string | null; emailVerifiedAt: Date | null }) => ({
  id: user.id, email: user.email, first_name: user.firstName, last_name: user.lastName, full_name: `${user.firstName} ${user.lastName}`.trim(), email_verified: !!user.emailVerifiedAt,
  avatar: user.avatarPath ? { small: user.avatarPath, medium: user.avatarPath, large: user.avatarPath } : null,
});
const credentials = z.object({ email: z.string().trim().email().max(254), password: z.string().min(12).max(128) });
const registerInput = credentials.extend({ first_name: z.string().trim().min(1).max(100), last_name: z.string().trim().min(1).max(100), password_confirmation: z.string() }).refine(v => v.password === v.password_confirmation, { message: 'Passwords do not match', path: ['password_confirmation'] });

app.get('/api/health/live', async (_request, reply) => ok(reply, { status: 'ok' }));
app.get('/api/health/ready', async (_request, reply) => { await prisma.$queryRaw`SELECT 1`; return ok(reply, { status: 'ready' }); });
app.get('/api/auth/csrf', async (_request, reply) => { const value = token(); reply.setCookie('gold_csrf', value, { httpOnly: false, secure: config.appUsesHttps, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 }); return ok(reply, { csrfToken: value }); });

app.post('/api/auth/register', { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } }, async (request, reply) => {
  const parsed = registerInput.safeParse(request.body); if (!parsed.success) return fail(reply, 422, parsed.error.issues[0]?.message ?? 'Invalid data', 'VALIDATION_ERROR');
  const input = parsed.data; const email = input.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email } })) return fail(reply, 422, 'Unable to create account', 'ACCOUNT_EXISTS');
  const user = await prisma.user.create({ data: { email, firstName: input.first_name, lastName: input.last_name, passwordHash: await argon2.hash(input.password, { type: argon2.argon2id }) } });
  const raw = token(); await prisma.session.create({ data: { userId: user.id, tokenHash: digest(raw), expiresAt: new Date(Date.now() + 30 * 86400000) } }); setSession(reply, raw);
  return ok(reply, publicUser(user));
});
app.post('/api/auth/login', { config: { rateLimit: { max: 10, timeWindow: '15 minutes' } } }, async (request, reply) => {
  const parsed = credentials.safeParse(request.body); if (!parsed.success) return fail(reply, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !await argon2.verify(user.passwordHash, parsed.data.password)) return fail(reply, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  await prisma.session.deleteMany({ where: { userId: user.id } }); const raw = token(); await prisma.session.create({ data: { userId: user.id, tokenHash: digest(raw), expiresAt: new Date(Date.now() + 30 * 86400000) } }); setSession(reply, raw);
  return ok(reply, publicUser(user));
});
app.get('/api/auth/who-am-i', async (request, reply) => {
  const raw = request.cookies[config.SESSION_COOKIE_NAME];
  if (!raw) return ok(reply, null);
  const session = await prisma.session.findUnique({ where: { tokenHash: digest(raw) } });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    clearSession(reply);
    return ok(reply, null);
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  return ok(reply, user ? publicUser(user) : null);
});
app.post('/api/auth/logout', { preHandler: authenticate }, async (request, reply) => { await prisma.session.deleteMany({ where: { userId: request.userId! } }); clearSession(reply); return ok(reply, { logged_out: true }); });
app.post('/api/auth/forgot-password', { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } }, async (request, reply) => { const email = z.object({ email: z.string().email() }).safeParse(request.body); if (email.success) { const user = await prisma.user.findUnique({ where: { email: email.data.email.toLowerCase() } }); if (user) { const raw = token(); await prisma.authToken.create({ data: { userId: user.id, kind: TokenKind.RESET_PASSWORD, tokenHash: digest(raw), expiresAt: new Date(Date.now() + 3600000) } }); app.log.info({ userId: user.id }, 'Password reset token generated; deliver through SMTP integration'); } } return ok(reply, { message: 'If the account exists, an email will be sent.' }); });
app.post('/api/auth/reset-password', { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } }, async (request, reply) => { const body = z.object({ token: z.string().min(20), password: z.string().min(12).max(128), password_confirmation: z.string() }).refine(v => v.password === v.password_confirmation).safeParse(request.body); if (!body.success) return fail(reply, 422, 'Invalid reset request', 'VALIDATION_ERROR'); const record = await prisma.authToken.findUnique({ where: { tokenHash: digest(body.data.token) } }); if (!record || record.kind !== TokenKind.RESET_PASSWORD || record.consumedAt || record.expiresAt < new Date()) return fail(reply, 422, 'Invalid or expired reset token', 'INVALID_TOKEN'); await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await argon2.hash(body.data.password, { type: argon2.argon2id }) } }), prisma.authToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } }), prisma.session.deleteMany({ where: { userId: record.userId } })]); return ok(reply, { reset: true }); });

app.get('/api/gold/get-overview', async (_request, reply) => ok(reply, { gold: await goldOverview() }));
app.get('/api/silver/get-overview', async (_request, reply) => { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.SILVER } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, include: { product: true } }); return ok(reply, rows.map(r => ({ id: r.product.key, name: r.product.displayName, sell_price: decimal(r.sell ?? r.price), price: decimal(r.price ?? r.sell), updated_at: r.recordedAt }))); });
app.get('/api/gold/calculate', async (request, reply) => { const q = z.object({ grams: z.coerce.number().positive().max(100000), karat: z.coerce.number().int().refine(k => [14, 18, 21, 22, 24].includes(k)) }).safeParse(request.query); if (!q.success) return fail(reply, 422, 'Invalid grams or karat', 'VALIDATION_ERROR'); const row = await latest(`gold-${q.data.karat}`); if (!row) return fail(reply, 404, 'Price unavailable', 'PRICE_UNAVAILABLE'); const unitPrice = decimal(row.sell ?? row.price); return ok(reply, { grams: q.data.grams, karat: q.data.karat, price_per_gram: unitPrice, total: unitPrice * q.data.grams, currency: 'EGP', updated_at: row.recordedAt }); });
app.get('/api/gold/gold-history', async (request, reply) => ok(reply, await goldHistory(request)));
app.get('/api/gold/get-all-prices', async (_request, reply) => ok(reply, { gold: await goldOverview() }));
app.get('/api/silver/get-all-prices', async (request, reply) => history(request, reply, MarketKind.SILVER));
app.get('/api/crypto', async (_request, reply) => { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.CRYPTO } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, include: { product: true } }); return ok(reply, rows.map(cryptoResponse)); });
app.get('/api/crypto/top', async (_request, reply) => { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.CRYPTO } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, take: 10, include: { product: true } }); return ok(reply, rows.map(cryptoResponse)); });
app.get('/api/currency/banks', async (_request, reply) => { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.CURRENCY } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, include: { product: true } }); return ok(reply, rows.map(r => ({ code: r.product.key, name: r.product.displayName, buy_price: decimal(r.buy), sell_price: decimal(r.sell), updated_at: r.recordedAt }))); });
app.get('/api/currency/averages', async (_request, reply) => currencyAverage(reply));
app.get('/api/currency/highest-buy-price', async (_request, reply) => currencyExtreme(reply, 'buy'));
app.get('/api/currency/highest-sell-price', async (_request, reply) => currencyExtreme(reply, 'sell'));
app.get('/api/currency/black-market', async (_request, reply) => { const item = await latest('currency-black-market-usd'); return item ? ok(reply, { buy_price: decimal(item.buy), sell_price: decimal(item.sell), updated_at: item.recordedAt }) : fail(reply, 404, 'Price unavailable', 'PRICE_UNAVAILABLE'); });

app.get('/api/category/child-categories', async (_request, reply) => ok(reply, await prisma.newsCategory.findMany()));

const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const newsDate = (value: Date) => value.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
const newsDateFormatted = (value: Date) => `${value.getUTCDate()} ${arabicMonths[value.getUTCMonth()]} ${value.getUTCFullYear()}`;
const newsDateHuman = (value: Date) => {
  const seconds = Math.max(0, Math.floor((Date.now() - value.getTime()) / 1000));
  if (seconds < 60) return 'منذ لحظات';
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
  if (hours === 1) return 'منذ ساعة واحدة';
  if (hours === 2) return 'منذ ساعتين';
  if (hours < 24) return `منذ ${hours} ساعات`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'منذ يوم واحد' : days === 2 ? 'منذ يومين' : `منذ ${days} أيام`;
};
const newsArticleResponse = (article: any, includeContent = false) => {
  const publishedAt = article.publishedAt ?? article.createdAt;
  return {
    id: article.id,
    title: article.title ?? article.originalTitle,
    description: article.description ?? '',
    image_url: article.imageUrl ?? '',
    is_rewritten: Boolean(article.title && article.title !== article.originalTitle),
    published_at: publishedAt.toISOString(),
    created_at: article.createdAt.toISOString(),
    date: newsDate(publishedAt),
    date_human: newsDateHuman(publishedAt),
    date_formatted: newsDateFormatted(publishedAt),
    category: article.category ? { id: article.category.id, name: article.category.title, slug: article.category.slug } : null,
    ...(includeContent ? { content: article.body ?? '', key_points: article.keyPoints ?? [] } : {}),
  };
};
app.get('/api/news/articles', async (request, reply) => {
  const q = z.object({ page: z.coerce.number().int().positive().default(1), search: z.string().trim().min(1).optional(), sort_by: z.enum(['latest', 'oldest']).default('latest') }).parse(request.query);
  const where: any = { published: true, ...(q.search ? { OR: [{ title: { contains: q.search } }, { originalTitle: { contains: q.search } }] } : {}) };
  const perPage = 20;
  const [total, items] = await Promise.all([
    prisma.newsArticle.count({ where }),
    prisma.newsArticle.findMany({ where, include: { category: true }, orderBy: { publishedAt: q.sort_by === 'latest' ? 'desc' : 'asc' }, skip: (q.page - 1) * perPage, take: perPage }),
  ]);
  return reply.send({ status: 200, success: true, data: items.map(item => newsArticleResponse(item)), pagination: { count: items.length, total, perPage, currentPage: q.page, totalPages: Math.ceil(total / perPage) } });
});
app.get('/api/news/articles/:id', async (request, reply) => { const routeId = String((request.params as any).id); const id = Number(/^\d+(?=-|$)/.exec(routeId)?.[0]) || -1; const item = await prisma.newsArticle.findFirst({ where: { published: true, OR: [{ slug: routeId }, { id }] }, include: { category: true } }); return item ? ok(reply, newsArticleResponse(item, true)) : fail(reply, 404, 'Article not found', 'NOT_FOUND'); });
app.get('/api/news/:id/get-related-newss', async (request, reply) => { const routeId = String((request.params as any).id); const id = Number(/^\d+(?=-|$)/.exec(routeId)?.[0]) || -1; const current = await prisma.newsArticle.findFirst({ where: { OR: [{ slug: routeId }, { id }] } }); if (!current) return ok(reply, []); return ok(reply, await prisma.newsArticle.findMany({ where: { published: true, categoryId: current.categoryId, id: { not: current.id } }, take: 4, orderBy: { publishedAt: 'desc' } })); });

app.get('/api/asset-portfolio', { preHandler: authenticate }, async (request, reply) => ok(reply, await portfolio(request.userId!)));
app.post('/api/asset-portfolio', { preHandler: authenticate }, async (request, reply) => { const body = z.object({ kind: z.nativeEnum(MarketKind), productKey: z.string().min(1).max(100), amount: z.coerce.number().positive(), buyPrice: z.coerce.number().positive(), currency: z.string().default('EGP'), purchasedAt: z.coerce.date(), notes: z.string().max(1000).optional() }).safeParse(request.body); if (!body.success) return fail(reply, 422, 'Invalid portfolio item', 'VALIDATION_ERROR'); return ok(reply, await prisma.portfolioItem.create({ data: { userId: request.userId!, ...body.data } })); });
app.delete('/api/asset-portfolio/:id', { preHandler: authenticate }, async (request, reply) => { const id = Number((request.params as any).id); const removed = await prisma.portfolioItem.deleteMany({ where: { id, userId: request.userId! } }); return removed.count ? ok(reply, { deleted: true }) : fail(reply, 404, 'Portfolio item not found', 'NOT_FOUND'); });
app.post('/api/auth/feature-disabled', async (_request, reply) => fail(reply, 503, 'This external provider is not configured', 'FEATURE_DISABLED'));

async function history(request: any, reply: any, kind: MarketKind) { const period = z.object({ period: z.enum(['24h', '7d', '30d', '1y', 'all']).default('30d') }).parse(request.query).period; const days: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '1y': 365, all: 3650 }; const after = new Date(Date.now() - days[period] * 86400000); const rows = await prisma.marketPrice.findMany({ where: { product: { kind }, recordedAt: { gte: after } }, include: { product: true }, orderBy: { recordedAt: 'asc' } }); return ok(reply, rows.map(r => ({ product: r.product.key, name: r.product.displayName, karat: r.product.karat, price: decimal(r.price ?? r.sell), buy_price: decimal(r.buy), sell_price: decimal(r.sell), date: r.recordedAt })), { period }); }
async function goldOverview() {
  const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.GOLD } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, include: { product: true } });
  const byKey = new Map(rows.map(row => [row.product.key, row]));
  const item = (key: string, color: string) => {
    const row = byKey.get(key);
    return row ? { currency: 'EGP', buy_price: decimal(row.buy), sell_price: decimal(row.sell ?? row.price), spread_egp: 0, spread_percent: 0, chart_points: [], chart_color: color, recorded_at: row.recordedAt } : null;
  };
  return { '24': item('gold-24', '#FFD700'), '21': item('gold-21', '#FFA500'), '18': item('gold-18', '#FF8C00'), gold_pound: item('gold-pound', '#B8860B'), ounce: null };
}
async function goldHistory(request: any) {
  const period = z.object({ period: z.enum(['24h', '7d', '30d', '1y', 'all']).default('30d') }).parse(request.query).period;
  const days: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '1y': 365, all: 3650 };
  const after = new Date(Date.now() - days[period] * 86400000);
  const rows = await prisma.marketPrice.findMany({ where: { product: { key: { in: ['gold-24', 'gold-21', 'gold-18'] } }, recordedAt: { gte: after } }, include: { product: true }, orderBy: { recordedAt: 'asc' } });
  const item = (key: string, color: string) => {
    const prices = rows.filter(row => row.product.key === key);
    const latestRow = prices.at(-1);
    return { currency: 'EGP', buy_price: decimal(latestRow?.buy), sell_price: decimal(latestRow?.sell ?? latestRow?.price), spread_egp: 0, spread_percent: 0, chart_points: prices.map(row => ({ date: row.recordedAt.toISOString(), price: decimal(row.price ?? row.sell) })), chart_color: color, recorded_at: latestRow?.recordedAt ?? new Date(0) };
  };
  return { period, currency: 'EGP', karat_24: item('gold-24', '#FFD700'), karat_21: item('gold-21', '#FFA500'), karat_18: item('gold-18', '#FF8C00') };
}
function cryptoResponse(row: any) {
  const raw = typeof row.raw === 'object' && row.raw ? row.raw as Record<string, unknown> : {};
  const coinId = row.product.key.replace('crypto-', '');
  return {
    coin_id: coinId,
    symbol: typeof raw.symbol === 'string' ? raw.symbol.toUpperCase() : coinId.slice(0, 5).toUpperCase(),
    name: row.product.displayName,
    image: typeof raw.image === 'string' ? raw.image : '',
    price_usd: decimal(row.price),
    change_24h: Number(raw.change24h ?? 0),
    change_7d: Number(raw.change7d ?? 0),
    volume_24h: Number(raw.volume ?? 0),
    market_cap: Number(raw.marketCap ?? 0),
    rank: Number(raw.marketCapRank ?? 0),
    recorded_at: row.recordedAt,
  };
}
async function currencyAverage(reply: any) { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.CURRENCY } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' } }); if (!rows.length) return fail(reply, 404, 'No data found', 'PRICE_UNAVAILABLE'); return ok(reply, { banks: { avg_buy_rate: rows.reduce((s,r)=>s+decimal(r.buy),0)/rows.length, avg_sell_rate: rows.reduce((s,r)=>s+decimal(r.sell),0)/rows.length, count: rows.length } }); }
async function currencyExtreme(reply: any, field: 'buy' | 'sell') { const rows = await prisma.marketPrice.findMany({ where: { product: { kind: MarketKind.CURRENCY } }, distinct: ['productId'], orderBy: { recordedAt: 'desc' }, include: { product: true } }); if (!rows.length) return fail(reply, 404, 'No data found', 'PRICE_UNAVAILABLE'); const selected = rows.sort((a,b)=>decimal(b[field])-decimal(a[field]))[0]; return ok(reply, { bank: selected.product.displayName, rate: decimal(selected[field]), updated_at: selected.recordedAt }); }
async function portfolio(userId: number) { const items = await prisma.portfolioItem.findMany({ where: { userId }, orderBy: { purchasedAt: 'desc' } }); return Promise.all(items.map(async item => { const price = await latest(item.productKey); const currentUnitPrice = price ? decimal(price.sell ?? price.price) : null; const amount = decimal(item.amount); const buyPrice = decimal(item.buyPrice); return { ...item, amount, buyPrice, current_unit_price: currentUnitPrice, cost_basis: amount * buyPrice, current_value: currentUnitPrice === null ? null : amount * currentUnitPrice, profit_loss: currentUnitPrice === null ? null : amount * (currentUnitPrice - buyPrice) }; })); }

const close = async () => { await app.close(); await prisma.$disconnect(); };
process.on('SIGINT', close); process.on('SIGTERM', close);
await app.listen({ host: '0.0.0.0', port: config.PORT });
