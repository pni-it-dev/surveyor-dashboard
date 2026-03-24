'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#dc2828', '#f97316', '#2563eb', '#8b5cf6'];

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
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      setData(result.maritalStatusBreakdown ?? []);
    };
    fetchData();
  }, [cityId]);

  const onSelect = (entry: any) => {
    const next = filters.selectedMaritalStatus.includes(entry.name)
      ? filters.selectedMaritalStatus.filter((s) => s !== entry.name)
      : [...filters.selectedMaritalStatus, entry.name];
    updateFilter('selectedMaritalStatus', next);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Status Pernikahan (Doughnut)</CardTitle></CardHeader>
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
