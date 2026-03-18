'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const GENERATION_COLORS: { [key: string]: string } = {
  'Gen Alpha': '#0ea5e9',
  'Gen Z': '#06b6d4',
  'Millennials': '#10b981',
  'Gen X': '#f59e0b',
  'Boomer II': '#ec4899',
  'Boomer I': '#8b5cf6',
};

interface AgeGroupChartProps {
  cityId: number | null;
}

export function AgeGroupChart({ cityId }: AgeGroupChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.ageGroupData && result.ageGroupData.length > 0) {
          const grouped = result.ageGroupData.reduce((acc: any, item: any) => {
            const existing = acc.find((x: any) => x.ageGroup === item.ageGroup);
            if (existing) {
              existing[item.generation] = item.count;
            } else {
              acc.push({
                ageGroup: item.ageGroup,
                [item.generation]: item.count,
              });
            }
            return acc;
          }, []);

          setData(grouped);
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
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Population by Age Group & Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
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
          <CardTitle className="text-base">Population by Age Group & Generation</CardTitle>
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
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <Legend />
              {Object.keys(GENERATION_COLORS).map((generation) => (
                <Bar
                  key={generation}
                  dataKey={generation}
                  stackId="a"
                  fill={GENERATION_COLORS[generation]}
                  radius={[8, 8, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Grouped by age range and sub-grouped by generation
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
