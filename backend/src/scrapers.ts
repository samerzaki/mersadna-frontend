import * as cheerio from 'cheerio';
import { MarketKind } from './generated/prisma/client.js';
import type { IncomingPrice } from './market.js';

const digits = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
function normalise(value: string) { return value.replace(/[\u0660-\u0669]/g, d => String(digits.indexOf(d))).replace(/[\u066c,]/g, '').replace('\u066b', '.'); }
function numericTokens(value: string) { return value.match(/[0-9\u0660-\u0669][0-9\u0660-\u0669\u066b\u066c,.]*/g) ?? []; }
export function parseArabicNumber(value: string) { const found = numericTokens(value).at(0); return found ? Number(normalise(found)) : NaN; }
function parseLastNumber(value: string) { const found = numericTokens(value).at(-1); return found ? Number(normalise(found)) : NaN; }

export function parseGoldBullionHtml(html: string): IncomingPrice[] {
  const $ = cheerio.load(html); const rows: IncomingPrice[] = []; const karats = [24, 22, 21, 18, 14];
  $('tr, .item, .price-item, div').each((_, node) => {
    const text = $(node).text(); const priceText = $(node).find('td').last().text() || text;
    const karat = karats.find(k => new RegExp(`(?:\\u0639\\u064a\\u0627\\u0631|karat)\\s*${k}`, 'i').test(text)); const price = parseLastNumber(priceText);
    if (karat && Number.isFinite(price) && price > 0) rows.push({ key: `gold-${karat}`, kind: MarketKind.GOLD, displayName: `Gold ${karat}K`, karat, sell: price, price });
  });
  return unique(rows);
}

export function parseSilverBullionHtml(html: string): IncomingPrice[] {
  const $ = cheerio.load(html); const rows: IncomingPrice[] = [];
  const variants: Array<[RegExp, string, string]> = [[/999.*swiss/i, 'silver-999-swiss', 'Silver 999 Swiss'], [/999.*egypt/i, 'silver-999-egypt', 'Silver 999 Egyptian'], [/925/i, 'silver-925', 'Silver 925'], [/800/i, 'silver-800', 'Silver 800'], [/ounce|\u0623\u0648\u0642\u064a\u0629/i, 'silver-ounce', 'Silver ounce']];
  $('tr, .item, .price-item, div').each((_, node) => { const text = $(node).text(); const found = variants.find(([rx]) => rx.test(text)); const price = parseLastNumber(text); if (found && Number.isFinite(price) && price > 0) rows.push({ key: found[1], kind: MarketKind.SILVER, displayName: found[2], sell: price, price }); });
  return unique(rows);
}

export function parseCoinGecko(payload: unknown): IncomingPrice[] {
  if (!Array.isArray(payload)) return [];
  return payload.slice(0, 50).flatMap((coin: any) => typeof coin?.id === 'string' && Number.isFinite(coin.current_price) && coin.current_price > 0 ? [{ key: `crypto-${coin.id}`, kind: MarketKind.CRYPTO, displayName: coin.name || coin.id, price: Number(coin.current_price), raw: { symbol: coin.symbol, change24h: coin.price_change_percentage_24h, change7d: coin.price_change_percentage_7d_in_currency } }] : []);
}
function unique(rows: IncomingPrice[]) { return [...new Map(rows.map(row => [row.key, row])).values()]; }
