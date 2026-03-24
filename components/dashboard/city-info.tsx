'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Users } from 'lucide-react';

interface CityInfoProps {
  cityId: number | null;
}

export function CityInfo({ cityId }: CityInfoProps) {
  const [city, setCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCity = async () => {
      if (!cityId) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/cities');
        const data = await response.json();

        if (data.cities) {
          const foundCity = data.cities.find((item: any) => item.id === cityId);
          setCity(foundCity ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch area:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCity();
  }, [cityId]);

  if (!city || isLoading) {
    return null;
  }

  const palette = city.palette ?? ['#f9c5d5', '#c7ceea', '#b5ead7'];

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className="overflow-hidden border-border/50 shadow-sm"
        style={{
          backgroundImage: `linear-gradient(135deg, ${palette[0]}33, ${palette[1]}33, ${palette[2]}33)`,
        }}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-2xl bg-background/80 p-3 shadow-sm">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold text-foreground">{city.name}</h2>
                <p className="mb-3 text-sm text-muted-foreground">{city.address}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-background/70 p-3">
                    <p className="text-xs text-muted-foreground">Kab/Kota ID</p>
                    <p className="font-semibold text-foreground">{city.kabkotId}</p>
                  </div>
                  <div className="rounded-2xl bg-background/70 p-3">
                    <p className="text-xs text-muted-foreground">Responden</p>
                    <p className="font-semibold text-foreground">{Number(city.respondentCount).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="rounded-2xl bg-background/70 p-3">
                    <p className="text-xs text-muted-foreground">Estimasi Populasi</p>
                    <p className="font-semibold text-foreground">{Number(city.totalPopulation).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-auto">
              <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Latitude</span>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">{city.latitude.toFixed(4)}</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/80 p-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs">Longitude</span>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">{city.longitude.toFixed(4)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
