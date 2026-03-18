'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, MapPin, Coffee, Hotel, Briefcase, Landmark } from 'lucide-react';

const POI_ICONS: { [key: string]: React.ReactNode } = {
  'Retail Store': <ShoppingCart className="h-5 w-5" />,
  'Restaurant': <Coffee className="h-5 w-5" />,
  'Hotel': <Hotel className="h-5 w-5" />,
  'Hospital': <Landmark className="h-5 w-5" />,
  'Gas Station': <MapPin className="h-5 w-5" />,
  'Bank': <Briefcase className="h-5 w-5" />,
  'School': <Landmark className="h-5 w-5" />,
  'Park': <MapPin className="h-5 w-5" />,
  'Shopping Mall': <ShoppingCart className="h-5 w-5" />,
  'Movie Theater': <Coffee className="h-5 w-5" />,
};

interface POISummaryProps {
  cityId: number | null;
}

export function POISummary({ cityId }: POISummaryProps) {
  const [pois, setPois] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;

      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();

        if (result.pointsOfInterest && result.pointsOfInterest.length > 0) {
          setPois(result.pointsOfInterest);
        }
      } catch (error) {
        console.error('Failed to fetch POI data:', error);
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
          <CardTitle className="text-base">Points of Interest (POI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
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
          <CardTitle className="text-base">Points of Interest (POI) Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pois.map((poi, index) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10 mb-2 text-primary">
                  {POI_ICONS[poi.poiType] || <MapPin className="h-5 w-5" />}
                </div>
                <p className="text-xs font-medium text-center text-foreground mb-1">
                  {poi.poiType}
                </p>
                <p className="text-lg font-bold text-primary">
                  {poi.count}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
