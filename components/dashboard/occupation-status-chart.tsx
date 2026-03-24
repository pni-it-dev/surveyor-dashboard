'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#b5ead7', '#c7ceea', '#f6d6ad', '#f9c5d5', '#d9c6f3'];

interface OccupationStatusChartProps {
  cityId: number | null;
}

export function OccupationStatusChart({ cityId }: OccupationStatusChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const total = useMemo(() => data.reduce((sum, d) => sum + Number(d.value || 0), 0), [data]);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();
        setData(result.occupationStatusBreakdown ?? []);
      } catch (error) {
        console.error('Failed to fetch occupation status data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cityId]);

  const handlePieClick = (entry: any) => {
    const newStatuses = filters.selectedOccupationStatus.includes(entry.name)
      ? filters.selectedOccupationStatus.filter((status) => status !== entry.name)
      : [...filters.selectedOccupationStatus, entry.name];
    updateFilter('selectedOccupationStatus', next);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Status Pekerjaan</CardTitle>
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
          <CardTitle className="text-base">Status Pekerjaan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={88}
                dataKey="value"
                onClick={(entry) => handlePieClick(entry)}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => Number(value).toLocaleString('id-ID')} />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Klik potongan chart untuk filter status pekerjaan.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
