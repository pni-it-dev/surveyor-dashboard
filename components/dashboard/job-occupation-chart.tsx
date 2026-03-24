'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useFilters } from '@/lib/filter-context';

interface JobOccupationChartProps {
  cityId: number | null;
}

const COLORS = ['#dc2828', '#2563eb', '#16a34a', '#f97316', '#a855f7', '#06b6d4', '#eab308', '#ec4899'];

export function JobOccupationChart({ cityId }: JobOccupationChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      setData(result.jobOccupations ?? []);
    };
    fetchData();
  }, [cityId]);

  const total = useMemo(() => data.reduce((sum, item) => sum + Number(item.value || 0), 0), [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Tipe Pekerjaan (Top kategori)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 210, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 12 }} interval={0} stroke="var(--muted-foreground)" />
              <Tooltip formatter={(v: any) => Number(v).toLocaleString('id-ID')} />
              <Legend />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} onClick={(barData: any) => {
                const next = filters.selectedJobOccupations.includes(barData.name)
                  ? filters.selectedJobOccupations.filter((job) => job !== barData.name)
                  : [...filters.selectedJobOccupations, barData.name];
                updateFilter('selectedJobOccupations', next);
              }}>
                {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground">Total terpetakan: {total.toLocaleString('id-ID')} responden. Klik batang untuk filter.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
