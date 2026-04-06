"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  BusFront,
  Coffee,
  Fuel,
  Hotel,
  Landmark,
  School,
  ShoppingBag,
  Trees,
} from "lucide-react";

const POI_ICONS: { [key: string]: React.ReactNode } = {
  "Toko dan Retail": <ShoppingBag className="h-5 w-5" />,
  FnB: <Coffee className="h-5 w-5" />,
  Pendidikan: <School className="h-5 w-5" />,
  "Perkantoran dan Komersil": <Building2 className="h-5 w-5" />,
  "Fasilitas Publik": <Landmark className="h-5 w-5" />,
  Manufaktur: <Building2 className="h-5 w-5" />,
  "Otomotif dan Jasa": <Building2 className="h-5 w-5" />,
  "Taman dan Rekreasi": <Trees className="h-5 w-5" />,
  "Hiburan Umum": <Coffee className="h-5 w-5" />,
  "Hiburan Dewasa": <Coffee className="h-5 w-5" />,
  "Pom Bensin": <Fuel className="h-5 w-5" />,
  "Rumah Sakit": <Landmark className="h-5 w-5" />,
  "Hotel dan Penginapan": <Hotel className="h-5 w-5" />,
  "Transportasi dan Pemberhentian": <BusFront className="h-5 w-5" />,
  "Fasilitas Olahraga dan Gelanggang": <Building2 className="h-5 w-5" />,
};

interface POISummaryProps {
  data: {
    id: number;
    poiType: string;
    count: number;
  }[];
  isLoading: boolean;
}

export function POISummary({ data = [], isLoading }: POISummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan POI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan POI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-6">
            No data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan POI Turunan</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.map((poi, index) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="flex flex-col items-center rounded-2xl border border-border/60 bg-linear-to-br from-card to-secondary/60 p-4 text-center hover:scale-[1.03] transition"
              >
                <div className="mb-2 rounded-2xl bg-primary/12 p-3 text-primary">
                  {POI_ICONS[poi.poiType] ?? <Landmark className="h-5 w-5" />}
                </div>

                <p className="mb-1 text-xs font-medium text-foreground line-clamp-2">
                  {poi.poiType}
                </p>

                <p className="text-lg font-bold text-primary">
                  {poi.count.toLocaleString("id-ID")}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Data POI faktual berdasarkan kode wilayah kecamatan
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
