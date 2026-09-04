'use client';

import { useEffect, useState } from 'react';

export default function DebugTablePage() {
  const [out, setOut] = useState('measuring...');

  useEffect(() => {
    const lines: string[] = [];
    lines.push('docDir=' + document.documentElement.dir);
    const header = document.querySelector('[data-dbg="h-sell"]') as HTMLElement;
    const cell = document.querySelector('[data-dbg="c-sell"]') as HTMLElement;
    const num = document.querySelector('[data-dbg="n-sell"]') as HTMLElement;
    const h2 = document.querySelector('[data-dbg="h-buy"]') as HTMLElement;
    const c2 = document.querySelector('[data-dbg="c-buy"]') as HTMLElement;
    const dump = (label: string, el: HTMLElement | null) => {
      if (!el) return label + ': MISSING';
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return `${label}: dir=${cs.direction} textAlign=${cs.textAlign} left=${r.left.toFixed(1)} right=${r.right.toFixed(1)}`;
    };
    lines.push(dump('headerSell', header));
    lines.push(dump('cellSellOuter', cell));
    lines.push(dump('cellSellNum', num));
    lines.push(dump('headerBuy', h2));
    lines.push(dump('cellBuyOuter', c2));
    const hr = header.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    const nr = num.getBoundingClientRect();
    lines.push(`headerTextLeft=${hr.left.toFixed(1)} cellOuterLeft=${cr.left.toFixed(1)} numLeft=${nr.left.toFixed(1)}`);
    setOut(lines.join('\n'));
  }, []);

  return (
    <div dir="rtl">
      <div
        className="grid items-center px-[22px] py-3.5 bg-panel2 text-[12px] text-muted"
        style={{ gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr' }}
      >
        <span>العيار</span>
        <span className="text-end" data-dbg="h-sell">سعر البيع</span>
        <span className="text-end" data-dbg="h-buy">سعر الشراء</span>
        <span className="text-end">التغير</span>
        <span className="text-end">30 يوم</span>
      </div>
      <div
        className="grid items-center px-[22px] py-4 border-t border-[var(--line2)]"
        style={{ gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr' }}
      >
        <span className="font-heading text-[15px] text-text">عيار 24</span>
        <span className="text-end" data-dbg="c-sell">
          <span className="num text-[16px] md:text-[18px] text-text" data-dbg="n-sell">
            {'\u200F'}7,269&nbsp;ج.م.{'\u200F'}
          </span>
        </span>
        <span className="text-end" data-dbg="c-buy">
          <span className="num text-[16px] md:text-[18px] text-muted">7,303 ج.م.</span>
        </span>
        <span className="text-end">-0.47%</span>
        <span className="flex justify-end">spark</span>
      </div>
      <pre id="dbg-out">{out}</pre>
    </div>
  );
}
