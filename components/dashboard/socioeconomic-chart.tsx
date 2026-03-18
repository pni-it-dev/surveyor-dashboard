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

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.socioeconomicData && result.socioeconomicData.length > 0) {
          const formatted = result.socioeconomicData.map((item: any) => ({
            name: item.category,
            value: item.value,
          }));
          setData(formatted);
        }
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
      ? filters.selectedSocioeconomic.filter((c) => c !== entry.name)
      : [...filters.selectedSocioeconomic, entry.name];

    updateFilter('selectedSocioeconomic', newCategories);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Social Economy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Social Economy</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <Bar
                dataKey="value"
                fill="var(--chart-3)"
                onClick={(data) => handleBarClick(data)}
                cursor="pointer"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Click on a bar to filter by social economy
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
