'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

interface JobOccupationChartProps {
  cityId: number | null;
}

export function JobOccupationChart({ cityId }: JobOccupationChartProps) {
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
        setData(result.jobOccupations ?? []);
      } catch (error) {
        console.error('Failed to fetch occupation type data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  const handleBarClick = (entry: any) => {
    const newJobs = filters.selectedJobOccupations.includes(entry.name)
      ? filters.selectedJobOccupations.filter((job) => job !== entry.name)
      : [...filters.selectedJobOccupations, entry.name];

    updateFilter('selectedJobOccupations', newJobs);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Tipe Pekerjaan</CardTitle>
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
          <CardTitle className="text-base">Tipe Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 160, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
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
                fill="var(--chart-2)"
                onClick={(barData) => handleBarClick(barData)}
                cursor="pointer"
                radius={[0, 10, 10, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Klik batang untuk filter tipe pekerjaan.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
