import { describe, expect, it } from 'vitest';
import { parseArabicNumber, parseCoinGecko, parseGoldBullionHtml, parseSilverBullionHtml } from '../src/scrapers.js';

describe('market parsers', () => {
  it('normalizes Arabic and western numerals', () => { expect(parseArabicNumber('٣٬٩٨٠٫٥٠ جنيه')).toBe(3980.5); expect(parseArabicNumber('4,120.75')).toBe(4120.75); });
  it('extracts known gold karats only', () => { const rows = parseGoldBullionHtml('<table><tr><td>عيار 21</td><td>٣٬٩٨٠</td></tr><tr><td>عيار 24</td><td>٤٬٥٥٠</td></tr></table>'); expect(rows).toEqual(expect.arrayContaining([expect.objectContaining({ key: 'gold-21', price: 3980 }), expect.objectContaining({ key: 'gold-24', price: 4550 })])); });
  it('rejects invalid crypto prices', () => { expect(parseCoinGecko([{ id: 'bitcoin', name: 'Bitcoin', current_price: 100000 }, { id: 'bad', current_price: 0 }])).toHaveLength(1); });
  it('extracts silver variants', () => { expect(parseSilverBullionHtml('<div>Silver 925 120.50</div>')).toEqual([expect.objectContaining({ key: 'silver-925', price: 120.5 })]); });
});
