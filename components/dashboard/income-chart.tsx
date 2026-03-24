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

      setIsLoading(true);
      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();
        setData(result.incomeData ?? []);
      } catch (error) {
        console.error('Failed to fetch income data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [cityId]);

  const handleBarClick = (entry: any) => {
    const newIncomes = filters.selectedIncomeRanges.includes(entry.name)
      ? filters.selectedIncomeRanges.filter((income) => income !== entry.name)
      : [...filters.selectedIncomeRanges, entry.name];

    updateFilter('selectedIncomeRanges', newIncomes);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Pendapatan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Pendapatan Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" angle={-35} textAnchor="end" height={72} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: any) => Number(value).toLocaleString('id-ID')}
              />
              <Bar
                dataKey="value"
                fill="var(--chart-4)"
                onClick={(barData) => handleBarClick(barData)}
                cursor="pointer"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Klik batang untuk filter rentang pendapatan.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
