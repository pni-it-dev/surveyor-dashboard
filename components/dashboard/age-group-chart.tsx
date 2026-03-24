'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GENERATION_COLORS: Record<string, string> = {
  'Gen Alpha': '#0ea5e9',
  'Gen Z': '#3b82f6',
  Millennials: '#10b981',
  'Gen X': '#f59e0b',
  Boomers: '#dc2626',
};

interface AgeGroupChartProps {
  cityId: number | null;
}

const AGE_ORDER = ['0-5','6-10','11-15','16-20','21-25','26-30','31-35','36-40','41-45','46-50','51-55','56-60','60+'];

export function AgeGroupChart({ cityId }: AgeGroupChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      const grouped = (result.ageGroupData ?? []).reduce((acc: any[], item: any) => {
        const found = acc.find((entry) => entry.ageGroup === item.ageGroup);
        if (found) found[item.generation] = item.value;
        else acc.push({ ageGroup: item.ageGroup, [item.generation]: item.value });
        return acc;
      }, []);
      grouped.sort((a: { ageGroup: string }, b: { ageGroup: string }) => AGE_ORDER.indexOf(a.ageGroup) - AGE_ORDER.indexOf(b.ageGroup));
      setData(grouped);
    };
    fetchData();
  }, [cityId]);

  const total = useMemo(() => data.reduce((sum, row) => sum + Object.entries(row).filter(([k]) => k !== 'ageGroup').reduce((s,[,v])=>s+Number(v||0),0), 0), [data]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Kelompok Usia per 5 Tahun & Generasi</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="ageGroup" stroke="var(--muted-foreground)" interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip formatter={(value: any) => Number(value).toLocaleString('id-ID')} />
              <Legend />
              {Object.entries(GENERATION_COLORS).map(([g, c]) => (
                <Bar key={g} dataKey={g} stackId="gen" fill={c} radius={[6,6,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground">Nilai menampilkan jumlah populasi (jumlah_anggota) tiap bucket usia dan generasi. Total: {total.toLocaleString('id-ID')}.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
