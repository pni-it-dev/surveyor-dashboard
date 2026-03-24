'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, BusFront, Coffee, Fuel, Hotel, Landmark, School, ShoppingBag, Trees } from 'lucide-react';

const POI_ICONS: { [key: string]: React.ReactNode } = {
  'Toko dan Retail': <ShoppingBag className="h-5 w-5" />,
  FnB: <Coffee className="h-5 w-5" />,
  Pendidikan: <School className="h-5 w-5" />,
  'Perkantoran dan Komersil': <Building2 className="h-5 w-5" />,
  'Fasilitas Publik': <Landmark className="h-5 w-5" />,
  Manufaktur: <Building2 className="h-5 w-5" />,
  'Otomotif dan Jasa': <Building2 className="h-5 w-5" />,
  'Taman dan Rekreasi': <Trees className="h-5 w-5" />,
  'Hiburan Umum': <Coffee className="h-5 w-5" />,
  'Hiburan Dewasa': <Coffee className="h-5 w-5" />,
  'Pom Bensin': <Fuel className="h-5 w-5" />,
  'Rumah Sakit': <Landmark className="h-5 w-5" />,
  'Hotel dan Penginapan': <Hotel className="h-5 w-5" />,
  'Transportasi dan Pemberhentian': <BusFront className="h-5 w-5" />,
  'Fasilitas Olahraga dan Gelanggang': <Building2 className="h-5 w-5" />,
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

      setIsLoading(true);
      try {
        const response = await fetch(`/api/demographics?cityId=${cityId}`);
        const result = await response.json();
        setPois(result.pointsOfInterest ?? []);
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
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan POI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan POI Turunan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pois.map((poi, index) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="flex flex-col items-center rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/60 p-4 text-center"
              >
                <div className="mb-2 rounded-2xl bg-primary/12 p-3 text-primary">
                  {POI_ICONS[poi.poiType] ?? <Landmark className="h-5 w-5" />}
                </div>
                <p className="mb-1 text-xs font-medium text-foreground">{poi.poiType}</p>
                <p className="text-lg font-bold text-primary">{Number(poi.count).toLocaleString('id-ID')}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            POI dihitung sebagai indikator turunan untuk kebutuhan dashboard sampai tabel POI fact tersedia.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
