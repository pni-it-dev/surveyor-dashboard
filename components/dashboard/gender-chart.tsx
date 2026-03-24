'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useFilters } from '@/lib/filter-context';

interface GenderChartProps {
  cityId: number | null;
}

const COLOR_MAP: Record<string, string> = {
  'LAKI LAKI': '#2563eb',
  'PEREMPUAN': '#ec4899',
};

export function GenderChart({ cityId }: GenderChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();
        setData(result.genderBreakdown ?? []);
      } catch (error) {
        console.error('Failed to fetch gender data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cityId]);

  const total = useMemo(() => data.reduce((sum, item) => sum + Number(item.value || 0), 0), [data]);

  const handleBarClick = (entry: any) => {
    const newGenders = filters.selectedGenders.includes(entry.name)
      ? filters.selectedGenders.filter((g) => g !== entry.name)
      : [...filters.selectedGenders, entry.name];
    updateFilter('selectedGenders', newGenders);
  };

  if (isLoading) {
    return <Card className="border-border/50"><CardHeader><CardTitle className="text-base">Komposisi Gender</CardTitle></CardHeader><CardContent><div className="h-80 rounded-lg bg-muted animate-pulse" /></CardContent></Card>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Komposisi Gender (Horizontal)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="name" type="category" width={110} stroke="var(--muted-foreground)" />
              <Tooltip formatter={(value: any) => Number(value).toLocaleString('id-ID')} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} cursor="pointer" onClick={(barData) => handleBarClick(barData)}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLOR_MAP[entry.name] ?? '#dc2828'} />
                ))}
                <LabelList dataKey="value" position="right" formatter={(v: number) => Number(v).toLocaleString('id-ID')} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Total responden: {total.toLocaleString('id-ID')}</span>
            <span>Klik bar untuk filter</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
