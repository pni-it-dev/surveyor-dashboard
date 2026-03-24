'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

interface SocioeconomicChartProps {
  cityId: number | null;
}

export function SocioeconomicChart({ cityId }: SocioeconomicChartProps) {
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
        setData(result.socioeconomicData ?? []);
      } catch (error) {
        console.error('Failed to fetch socioeconomic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  const handleBarClick = (entry: any) => {
    const newCategories = filters.selectedSocioeconomic.includes(entry.name)
      ? filters.selectedSocioeconomic.filter((category) => category !== entry.name)
      : [...filters.selectedSocioeconomic, entry.name];

    updateFilter('selectedSocioeconomic', newCategories);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Kelas Sosial Ekonomi</CardTitle>
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
          <CardTitle className="text-base">Kelas Sosial Ekonomi</CardTitle>
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
                fill="var(--chart-3)"
                onClick={(barData) => handleBarClick(barData)}
                cursor="pointer"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Klik batang untuk filter kelas sosial ekonomi.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
