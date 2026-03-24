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

const CARD_COLORS = ['from-red-50 to-red-100', 'from-blue-50 to-blue-100', 'from-emerald-50 to-emerald-100', 'from-amber-50 to-amber-100', 'from-fuchsia-50 to-fuchsia-100'];

interface POISummaryProps { cityId: number | null; }

export function POISummary({ cityId }: POISummaryProps) {
  const [pois, setPois] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!cityId) return;
      const response = await fetch(`/api/demographics?cityId=${cityId}`);
      const result = await response.json();
      setPois(result.pointsOfInterest ?? []);
    };
    fetchData();
  }, [cityId]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-base">Ringkasan POI Turunan</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {pois.map((poi, index) => (
              <div key={poi.id} className={`rounded-2xl border border-border/60 bg-gradient-to-br p-4 ${CARD_COLORS[index % CARD_COLORS.length]}`}>
                <div className="mb-2 inline-flex rounded-xl bg-white/85 p-2 text-primary">{POI_ICONS[poi.poiType] ?? <Landmark className="h-5 w-5" />}</div>
                <p className="line-clamp-2 min-h-10 text-xs font-medium text-foreground">{poi.poiType}</p>
                <p className="mt-1 text-lg font-bold text-primary">{Number(poi.count).toLocaleString('id-ID')}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Angka POI adalah indikator turunan untuk membaca potensi layanan per area.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
