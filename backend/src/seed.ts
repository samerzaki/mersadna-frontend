import { MarketKind } from './generated/prisma/client.js';
import { prisma } from './db.js';

type SeedProduct = {
  key: string;
  kind: MarketKind;
  displayName: string;
  karat?: number;
  currency?: string;
  buy?: number;
  sell?: number;
  price?: number;
  raw?: Record<string, unknown>;
};

const products: SeedProduct[] = [
  { key: 'gold-24', kind: MarketKind.GOLD, displayName: 'Gold 24K', karat: 24, currency: 'EGP', buy: 6650, sell: 6680, price: 6680 },
  { key: 'gold-22', kind: MarketKind.GOLD, displayName: 'Gold 22K', karat: 22, currency: 'EGP', buy: 6085, sell: 6115, price: 6115 },
  { key: 'gold-21', kind: MarketKind.GOLD, displayName: 'Gold 21K', karat: 21, currency: 'EGP', buy: 5820, sell: 5850, price: 5850 },
  { key: 'gold-18', kind: MarketKind.GOLD, displayName: 'Gold 18K', karat: 18, currency: 'EGP', buy: 4985, sell: 5015, price: 5015 },
  { key: 'gold-14', kind: MarketKind.GOLD, displayName: 'Gold 14K', karat: 14, currency: 'EGP', buy: 3875, sell: 3900, price: 3900 },
  { key: 'gold-pound', kind: MarketKind.GOLD, displayName: 'Gold Pound', currency: 'EGP', buy: 46560, sell: 46800, price: 46800 },
  { key: 'silver-999-swiss', kind: MarketKind.SILVER, displayName: 'Silver 999 Swiss', currency: 'EGP', buy: 104.5, sell: 106, price: 106 },
  { key: 'silver-999-egypt', kind: MarketKind.SILVER, displayName: 'Silver 999 Egyptian', currency: 'EGP', buy: 100.5, sell: 102, price: 102 },
  { key: 'silver-925', kind: MarketKind.SILVER, displayName: 'Silver 925', currency: 'EGP', buy: 93, sell: 94.5, price: 94.5 },
  { key: 'silver-800', kind: MarketKind.SILVER, displayName: 'Silver 800', currency: 'EGP', buy: 80, sell: 81.5, price: 81.5 },
  { key: 'currency-usd', kind: MarketKind.CURRENCY, displayName: 'US Dollar', currency: 'EGP', buy: 49.35, sell: 49.5, price: 49.5 },
  { key: 'currency-eur', kind: MarketKind.CURRENCY, displayName: 'Euro', currency: 'EGP', buy: 53.4, sell: 53.65, price: 53.65 },
  { key: 'currency-gbp', kind: MarketKind.CURRENCY, displayName: 'British Pound', currency: 'EGP', buy: 62.4, sell: 62.7, price: 62.7 },
  { key: 'currency-sar', kind: MarketKind.CURRENCY, displayName: 'Saudi Riyal', currency: 'EGP', buy: 13.12, sell: 13.2, price: 13.2 },
  { key: 'currency-aed', kind: MarketKind.CURRENCY, displayName: 'UAE Dirham', currency: 'EGP', buy: 13.42, sell: 13.49, price: 13.49 },
  { key: 'crypto-bitcoin', kind: MarketKind.CRYPTO, displayName: 'Bitcoin', currency: 'USD', price: 68500, raw: { symbol: 'btc', change24h: 1.8, change7d: 4.2 } },
  { key: 'crypto-ethereum', kind: MarketKind.CRYPTO, displayName: 'Ethereum', currency: 'USD', price: 3540, raw: { symbol: 'eth', change24h: 1.2, change7d: 3.1 } },
  { key: 'crypto-tether', kind: MarketKind.CRYPTO, displayName: 'Tether', currency: 'USD', price: 1, raw: { symbol: 'usdt', change24h: 0.01, change7d: 0.02 } },
  { key: 'crypto-binancecoin', kind: MarketKind.CRYPTO, displayName: 'BNB', currency: 'USD', price: 615, raw: { symbol: 'bnb', change24h: -0.6, change7d: 2.3 } },
  { key: 'crypto-solana', kind: MarketKind.CRYPTO, displayName: 'Solana', currency: 'USD', price: 178, raw: { symbol: 'sol', change24h: 2.1, change7d: 6.4 } },
];

async function upsertProducts() {
  return Promise.all(products.map(item => prisma.marketProduct.upsert({
    where: { key: item.key },
    create: { key: item.key, kind: item.kind, displayName: item.displayName, karat: item.karat, currency: item.currency, source: 'seed' },
    update: { kind: item.kind, displayName: item.displayName, karat: item.karat, currency: item.currency, source: 'seed', active: true },
  })));
}

function priceMultiplier(item: SeedProduct, daysAgo: number) {
  const dailyTrend = item.kind === MarketKind.GOLD ? 0.00078 : item.kind === MarketKind.SILVER ? 0.00062 : item.kind === MarketKind.CRYPTO ? 0.00045 : 0.00012;
  const volatility = item.kind === MarketKind.GOLD ? 0.009 : item.kind === MarketKind.SILVER ? 0.014 : item.kind === MarketKind.CRYPTO ? 0.055 : 0.004;
  return (1 - dailyTrend * daysAgo) * (1 + volatility * Math.sin(daysAgo * 0.31) + volatility * 0.35 * Math.sin(daysAgo * 0.07));
}

async function addPrices(days: number[], source: string) {
  const seeded = await upsertProducts();
  const productIds = new Map(seeded.map(product => [product.key, product.id]));
  let records = 0;
  for (const item of products) {
    for (const day of days) {
      const factor = priceMultiplier(item, day);
      await prisma.marketPrice.create({
        data: { productId: productIds.get(item.key)!, buy: item.buy ? item.buy * factor : undefined, sell: item.sell ? item.sell * factor : undefined, price: (item.price ?? item.sell ?? item.buy ?? 0) * factor, raw: { ...(item.raw ?? {}), seed: true, source }, recordedAt: new Date(Date.now() - day * 86400000) },
      });
      records++;
    }
  }
  return records;
}

async function runSeed(source: string, days: number[]) {
  const complete = await prisma.ingestionRun.findFirst({ where: { source, status: 'success' } });
  if (complete) return 0;
  const run = await prisma.ingestionRun.create({ data: { source, status: 'running' } });
  const records = await addPrices(days, source);
  await prisma.ingestionRun.update({ where: { id: run.id }, data: { status: 'success', records, completedAt: new Date() } });
  return records;
}

async function main() {
  const currentWeek = await runSeed('seed:market', [6, 5, 4, 3, 2, 1, 0]);
  const historical = await runSeed('seed:market:history-v2', Array.from({ length: 174 }, (_, index) => 180 - index));
  if (!currentWeek && !historical) {
    console.log('Market seed already exists; no changes made.');
    return;
  }
  console.log(`Seeded ${currentWeek + historical} fake market prices, including 180 days of realistic historical trends.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
