'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#2563eb', '#0ea5e9', '#14b8a6', '#f59e0b', '#dc2626'];

interface IncomeChartProps { cityId: number | null; }

export function IncomeChart({ cityId }: IncomeChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const total = useMemo(() => data.reduce((s, d) => s + Number(d.value || 0), 0), [data]);

  useEffect(() => {
    const load = async () => {
      if (!cityId) return;
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      setData(result.incomeData ?? []);
    };
    load();
  }, [cityId]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50"><CardHeader><CardTitle className="text-base">Range Pendapatan Bulanan</CardTitle></CardHeader><CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" interval={0} />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip formatter={(v: any) => Number(v).toLocaleString('id-ID')} />
            <Bar dataKey="value" onClick={(barData: any) => {
              const next = filters.selectedIncomeRanges.includes(barData.name)
                ? filters.selectedIncomeRanges.filter((x) => x !== barData.name)
                : [...filters.selectedIncomeRanges, barData.name];
              updateFilter('selectedIncomeRanges', next);
            }}>
              {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground">Total: {total.toLocaleString('id-ID')} responden.</p>
      </CardContent></Card>
    </motion.div>
  );
}
