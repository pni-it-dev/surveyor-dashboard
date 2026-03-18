'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CityInfoProps {
  cityId: number | null;
}

export function CityInfo({ cityId }: CityInfoProps) {
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
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {city.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {city.address}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Latitude
                  </p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {city.latitude.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Longitude
                  </p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {city.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
