'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PriceHistory } from '@/types';
import { formatPrice, formatPercent, formatRelativeTime } from '@/lib/format';
import { TrendIndicator } from '@/components/dashboard/trend-indicator';
import { KARATS } from '@/lib/constants';

interface HistoryTableProps {
  data: PriceHistory[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  const getKaratName = (code: string) => {
    return KARATS.find((k) => k.code === code)?.name || code;
  };

  return (
    <div className="rounded-md border">
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
              <TableCell colSpan={6} className="text-center text-muted-foreground">
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
                  <TableCell className="font-semibold">
                    {formatPrice(item.buyPrice)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPrice(item.sellPrice)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        isPositive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {formatPrice(item.change)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isPositive ? 'default' : 'destructive'}>
                      <TrendIndicator change={item.change} showIcon={false} />
                      {formatPercent(item.changePercent)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
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
