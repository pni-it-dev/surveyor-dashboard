'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#f9c5d5', '#f8d49d', '#b5ead7', '#c7ceea'];

interface MaritalStatusChartProps {
  cityId: number | null;
}

export function MaritalStatusChart({ cityId }: MaritalStatusChartProps) {
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
        setData(result.maritalStatusBreakdown ?? []);
      } catch (error) {
        console.error('Failed to fetch marital status data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [cityId]);

  const handlePieClick = (entry: any) => {
    const newStatuses = filters.selectedMaritalStatus.includes(entry.name)
      ? filters.selectedMaritalStatus.filter((status) => status !== entry.name)
      : [...filters.selectedMaritalStatus, entry.name];
    updateFilter('selectedMaritalStatus', next);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Status Pernikahan</CardTitle>
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
          <CardTitle className="text-base">Status Pernikahan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${Number(value).toLocaleString('id-ID')}`}
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
            Klik potongan chart untuk filter status pernikahan.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
