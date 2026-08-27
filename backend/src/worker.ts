import { Queue, Worker } from 'bullmq';
import { MarketKind } from './generated/prisma/client.js';
import { config } from './config.js';
import { prisma } from './db.js';
import { storePrices, type IncomingPrice } from './market.js';
import { parseCoinGecko, parseGoldBullionHtml, parseSilverBullionHtml } from './scrapers.js';

const connection = { url: config.REDIS_URL, maxRetriesPerRequest: null };
const queue = new Queue('market-ingestion', { connection });
const endpoints = {
  gold: process.env.GOLD_BULLION_URL,
  silver: process.env.SILVER_BULLION_URL,
  crypto: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=7d',
};

async function fetchJsonOrHtml(url: string) {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
  try { const response = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'GoldMarketBot/1.0 (+contact@example.invalid)', accept: 'application/json,text/html' } }); if (!response.ok) throw new Error(`Upstream returned ${response.status}`); return response.headers.get('content-type')?.includes('json') ? response.json() : response.text(); } finally { clearTimeout(timeout); }
}

async function ingest(source: 'gold' | 'silver' | 'crypto') {
  const run = await prisma.ingestionRun.create({ data: { source, status: 'running' } });
  try {
    let rows: IncomingPrice[] = [];
    const url = endpoints[source];
    if (!url) throw new Error(`${source.toUpperCase()}_BULLION_URL is not configured`);
    const payload = await fetchJsonOrHtml(url);
    if (source === 'gold') rows = parseGoldBullionHtml(String(payload));
    if (source === 'silver') rows = parseSilverBullionHtml(String(payload));
    if (source === 'crypto') rows = parseCoinGecko(payload);
    if (!rows.length) throw new Error('Source returned no valid prices');
    const records = await storePrices(rows);
    await prisma.ingestionRun.update({ where: { id: run.id }, data: { status: 'success', records, completedAt: new Date() } });
  } catch (error) {
    await prisma.ingestionRun.update({ where: { id: run.id }, data: { status: 'failed', error: error instanceof Error ? error.message.slice(0, 500) : 'Unknown error', completedAt: new Date() } });
    throw error;
  }
}

new Worker('market-ingestion', async job => ingest(job.name as 'gold' | 'silver' | 'crypto'), { connection, concurrency: 2 });
const schedules = [
  queue.upsertJobScheduler('crypto-5m', { pattern: '*/5 * * * *' }, { name: 'crypto', data: {}, opts: { attempts: 3, backoff: { type: 'exponential', delay: 30000 } } }),
  ...(endpoints.gold ? [queue.upsertJobScheduler('gold-5m', { pattern: '*/5 * * * *' }, { name: 'gold', data: {}, opts: { attempts: 3, backoff: { type: 'exponential', delay: 30000 } } })] : []),
  ...(endpoints.silver ? [queue.upsertJobScheduler('silver-6h', { pattern: '0 */6 * * *' }, { name: 'silver', data: {}, opts: { attempts: 3, backoff: { type: 'exponential', delay: 60000 } } })] : []),
];
await Promise.all(schedules);
await queue.add('crypto', {}, { jobId: `bootstrap-crypto-${new Date().toISOString().slice(0, 10)}` });
