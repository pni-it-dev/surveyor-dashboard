'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Komposisi Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-border/50 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Komposisi Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
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
                fill="var(--chart-1)"
                onClick={(barData) => handleBarClick(barData)}
                cursor="pointer"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Klik batang chart untuk aktifkan filter gender.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
