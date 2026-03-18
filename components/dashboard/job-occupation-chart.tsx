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

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.jobOccupations && result.jobOccupations.length > 0) {
          const formatted = result.jobOccupations.map((job: any) => ({
            name: job.occupation,
            value: job.count,
          }));
          setData(formatted);
        }
      } catch (error) {
        console.error('Failed to fetch job occupation data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  const handleBarClick = (entry: any) => {
    const newJobs = filters.selectedJobOccupations.includes(entry.name)
      ? filters.selectedJobOccupations.filter((j) => j !== entry.name)
      : [...filters.selectedJobOccupations, entry.name];

    updateFilter('selectedJobOccupations', newJobs);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Population by Job Occupation</CardTitle>
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
          <CardTitle className="text-base">Population by Job Occupation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <Bar
                dataKey="value"
                fill="var(--chart-2)"
                onClick={(data) => handleBarClick(data)}
                cursor="pointer"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Click on a bar to filter by job occupation
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
