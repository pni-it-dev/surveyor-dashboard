'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, Users2 } from 'lucide-react';

interface DemographicsSummaryProps {
  cityId: number | null;
}

interface DemoData {
  totalPopulation: number;
  totalHouseholds: number;
  avgHouseholdSize: number;
}

export function DemographicsSummary({ cityId }: DemographicsSummaryProps) {
  const [data, setData] = useState<DemoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(
          `/api/demographics?cityId=${cityId}`
        );
        const result = await response.json();

        if (result.demographics) {
          setData({
            totalPopulation: result.demographics.totalPopulation,
            totalHouseholds: result.demographics.totalHouseholds,
            avgHouseholdSize: parseFloat(
              result.demographics.avgHouseholdSize
            ),
          });
        }
      } catch (error) {
        console.error('Failed to fetch demographics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cityId]);

  if (!data || isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Population',
      value: data.totalPopulation.toLocaleString(),
    },
    {
      icon: Home,
      label: 'Total Households',
      value: data.totalHouseholds.toLocaleString(),
    },
    {
      icon: Users2,
      label: 'Avg Household Size',
      value: data.avgHouseholdSize.toFixed(2),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Demographics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-bold text-lg text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
