'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#2563eb', '#8b5cf6'];

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
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      setData(result.occupationStatusBreakdown ?? []);
    };
    fetchData();
  }, [cityId]);

  const onSelect = (entry: any) => {
    const next = filters.selectedOccupationStatus.includes(entry.name)
      ? filters.selectedOccupationStatus.filter((s) => s !== entry.name)
      : [...filters.selectedOccupationStatus, entry.name];
    updateFilter('selectedOccupationStatus', next);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Status Pekerjaan (Doughnut)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} onClick={onSelect} cursor="pointer" label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}>
                {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => Number(v).toLocaleString('id-ID')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground">Total kategori: {total.toLocaleString('id-ID')} responden.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
