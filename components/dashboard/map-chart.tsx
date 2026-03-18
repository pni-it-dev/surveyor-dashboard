'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

interface MapChartProps {
  cityId: number | null;
}

export function MapChart({ cityId }: MapChartProps) {
  const [city, setCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/cities`);
        const data = await response.json();

        if (data.cities) {
          const foundCity = data.cities.find((c: any) => c.id === cityId);
          setCity(foundCity);
        }
      } catch (error) {
        console.error('Failed to fetch city:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCity();
  }, [cityId]);

  if (!city || isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full bg-muted rounded-lg animate-pulse" />
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
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Trade Area Map - {city.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapComponent city={city} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
