'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

interface GenderChartProps {
  cityId: number | null;
}

export function GenderChart({ cityId }: GenderChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.genderBreakdown && result.genderBreakdown.length > 0) {
          const gender = result.genderBreakdown[0];
          setData([
            { name: 'Male', value: gender.male },
            { name: 'Female', value: gender.female },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch gender data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  const handleBarClick = (entry: any) => {
    const newGenders = filters.selectedGenders.includes(entry.name)
      ? filters.selectedGenders.filter((g) => g !== entry.name)
      : [...filters.selectedGenders, entry.name];

    updateFilter('selectedGenders', newGenders);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Population by Gender</CardTitle>
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
          <CardTitle className="text-base">Population by Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Bar
                dataKey="value"
                fill="var(--chart-1)"
                onClick={(data) => handleBarClick(data)}
                cursor="pointer"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Click on a bar to filter by gender
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
