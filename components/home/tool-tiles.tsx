'use client';

import Link from 'next/link';
import { Calculator, HandHeart, ArrowLeftRight, LineChart, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface Tool {
  href: string;
  icon: LucideIcon;
  name: string;
  desc: string;
}

export function ToolTiles() {
  const { t } = useLanguage();

  const TOOLS: Tool[] = [
    { href: '/gold/calculator', icon: Calculator, name: t.home2026.toolGoldCalcName, desc: t.home2026.toolGoldCalcDesc },
    { href: '/gold/zakat', icon: HandHeart, name: t.home2026.toolZakatName, desc: t.home2026.toolZakatDesc },
    { href: '/currencies/calculator', icon: ArrowLeftRight, name: t.home2026.toolCurrencyConverterName, desc: t.home2026.toolCurrencyConverterDesc },
    { href: '/gold', icon: LineChart, name: t.home2026.toolGoldDetailedName, desc: t.home2026.toolGoldDetailedDesc },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {TOOLS.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="card-surface flex items-center gap-3 p-5 hover:shadow-gold transition-shadow"
        >
          <span className="flex items-center justify-center size-9 rounded-[10px] bg-panel2 text-gold">
            <tool.icon className="size-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text">{tool.name}</p>
            <p className="mt-1 text-[11px] text-dim leading-relaxed">{tool.desc}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
