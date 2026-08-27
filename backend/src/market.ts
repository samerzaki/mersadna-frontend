import { MarketKind, Prisma } from './generated/prisma/client.js';
import { prisma } from './db.js';

export type IncomingPrice = { key: string; kind: MarketKind; displayName: string; karat?: number; buy?: number; sell?: number; price?: number; raw?: Prisma.InputJsonValue };

export async function storePrices(rows: IncomingPrice[]) {
  let inserted = 0;
  for (const item of rows) {
    const values = [item.buy, item.sell, item.price].filter((v): v is number => v !== undefined && Number.isFinite(v) && v > 0);
    if (!values.length) continue;
    const product = await prisma.marketProduct.upsert({
      where: { key: item.key },
      create: { key: item.key, kind: item.kind, displayName: item.displayName, karat: item.karat },
      update: { displayName: item.displayName, karat: item.karat },
    });
    const previous = await prisma.marketPrice.findFirst({ where: { productId: product.id }, orderBy: { recordedAt: 'desc' } });
    const changed = !previous || ['buy', 'sell', 'price'].some((field) => {
      const next = item[field as keyof IncomingPrice] as number | undefined;
      const old = previous[field as keyof typeof previous] as unknown as Prisma.Decimal | null;
      return next !== undefined && Math.abs((old?.toNumber?.() ?? 0) - next) >= 0.01;
    });
    if (changed) {
      await prisma.marketPrice.create({ data: { productId: product.id, buy: item.buy, sell: item.sell, price: item.price, raw: item.raw } });
      inserted++;
    }
  }
  return inserted;
}

export async function latest(key: string) {
  return prisma.marketPrice.findFirst({ where: { product: { key } }, include: { product: true }, orderBy: { recordedAt: 'desc' } });
}

export const decimal = (value: unknown) => Number(value ?? 0);
