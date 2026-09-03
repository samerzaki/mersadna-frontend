'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PriceHistory } from '@/types';
import { formatPrice, formatRelativeTime } from '@/lib/format';
import { ChangeChip } from '@/components/ui/change-badge';
import { KARATS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface HistoryTableProps {
  data: PriceHistory[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  const getKaratName = (code: string) => {
    return KARATS.find((k) => k.code === code)?.name || code;
  };

  return (
    <div className="card-surface overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">العيار</TableHead>
            <TableHead className="text-right">سعر الشراء</TableHead>
            <TableHead className="text-right">سعر البيع</TableHead>
            <TableHead className="text-right">التغيير</TableHead>
            <TableHead className="text-right">النسبة</TableHead>
            <TableHead className="text-right">التوقيت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted">
                لا توجد بيانات
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {getKaratName(item.karat)}
                  </TableCell>
                  <TableCell className="num font-semibold">
                    {formatPrice(item.buyPrice)}
                  </TableCell>
                  <TableCell className="num text-muted">
                    {formatPrice(item.sellPrice)}
                  </TableCell>
                  <TableCell>
                    <span className={cn('num', isPositive ? 'text-up' : 'text-down')}>
                      {formatPrice(item.change)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ChangeChip value={item.changePercent} />
                  </TableCell>
                  <TableCell className="text-sm text-muted">
                    {formatRelativeTime(item.recordedAt)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
