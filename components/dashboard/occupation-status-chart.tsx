'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters } from '@/lib/filter-context';

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface OccupationStatusChartProps {
  cityId: number | null;
}

export function OccupationStatusChart({ cityId }: OccupationStatusChartProps) {
  const { filters, updateFilter } = useFilters();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.occupationStatusBreakdown && result.occupationStatusBreakdown.length > 0) {
          const status = result.occupationStatusBreakdown[0];
          setData([
            { name: 'Employed', value: status.employed },
            { name: 'Unemployed', value: status.unemployed },
            { name: 'Student', value: status.student },
            { name: 'Retired', value: status.retired },
            { name: 'Other', value: status.other },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch occupation status data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  const handlePieClick = (entry: any) => {
    const newStatuses = filters.selectedOccupationStatus.includes(entry.name)
      ? filters.selectedOccupationStatus.filter((s) => s !== entry.name)
      : [...filters.selectedOccupationStatus, entry.name];

    updateFilter('selectedOccupationStatus', newStatuses);
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Population by Occupation Status</CardTitle>
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
          <CardTitle className="text-base">Population by Occupation Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
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
            Click on a section to filter by occupation status
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
