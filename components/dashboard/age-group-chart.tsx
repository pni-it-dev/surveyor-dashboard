'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GENERATION_COLORS: { [key: string]: string } = {
  'Gen Alpha': '#f9c5d5',
  'Gen Z': '#c7ceea',
  Millennials: '#b5ead7',
  'Gen X': '#f6d6ad',
  Boomers: '#d9c6f3',
};

interface AgeGroupChartProps {
  cityId: number | null;
}

export function AgeGroupChart({ cityId }: AgeGroupChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.ageGroupData && result.ageGroupData.length > 0) {
          const grouped = result.ageGroupData.reduce((acc: any[], item: any) => {
            const existing = acc.find((entry) => entry.ageGroup === item.ageGroup);
            if (existing) {
              existing[item.generation] = item.value;
            } else {
              acc.push({
                ageGroup: item.ageGroup,
                [item.generation]: item.value,
              });
            }
            return acc;
          }, []);

          setData(grouped);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Failed to fetch age group data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Kelompok Usia & Generasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Kelompok Usia & Generasi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="ageGroup" stroke="var(--muted-foreground)" />
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
              <Legend />
              {Object.keys(GENERATION_COLORS).map((generation) => (
                <Bar
                  key={generation}
                  dataKey={generation}
                  stackId="a"
                  fill={GENERATION_COLORS[generation]}
                  radius={[10, 10, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Distribusi umur dibentuk langsung dari tabel fact memakai bucket usia.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
