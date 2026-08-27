'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { KaratCode } from '@/types';
import { KARATS } from '@/lib/constants';

interface HistoryFiltersProps {
  selectedKarat: KaratCode | 'all';
  onKaratChange: (karat: KaratCode | 'all') => void;
}

export function HistoryFilters({
  selectedKarat,
  onKaratChange,
}: HistoryFiltersProps) {
  const getKaratLabel = () => {
    if (selectedKarat === 'all') return 'جميع العيارات';
    return KARATS.find((k) => k.code === selectedKarat)?.name || selectedKarat;
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {getKaratLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>تصفية حسب العيار</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedKarat}
            onValueChange={(value) => onKaratChange(value as KaratCode | 'all')}
          >
            <DropdownMenuRadioItem value="all">
              جميع العيارات
            </DropdownMenuRadioItem>
            {KARATS.map((karat) => (
              <DropdownMenuRadioItem key={karat.code} value={karat.code}>
                {karat.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
