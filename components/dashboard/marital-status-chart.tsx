'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b'];

interface MaritalStatusChartProps {
  cityId: number | null;
}

export function MaritalStatusChart({ cityId }: MaritalStatusChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.maritalStatusBreakdown && result.maritalStatusBreakdown.length > 0) {
          const marital = result.maritalStatusBreakdown[0];
          setData([
            { name: 'Married', value: marital.married },
            { name: 'Single', value: marital.single },
            { name: 'Widow', value: marital.widow },
            { name: 'Divorced', value: marital.divorced },
          ]);
        }
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
      ? filters.selectedMaritalStatus.filter((s) => s !== entry.name)
      : [...filters.selectedMaritalStatus, entry.name];

    updateFilter('selectedMaritalStatus', newStatuses);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Population by Marital Status</CardTitle>
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
          <CardTitle className="text-base">Population by Marital Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(entry) => handlePieClick(entry)}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Click on a section to filter by marital status
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
