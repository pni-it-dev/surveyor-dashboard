'use client';

import { motion } from 'framer-motion';
import { Compass, MapPin, Sparkles } from 'lucide-react';

interface MapComponentProps {
  city: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
    respondentCount: number;
    totalPopulation: number;
    palette?: string[];
  };
}

function flattenCoordinates(feature?: GeoFeature) {
  if (!feature?.geometry?.coordinates) return [] as [number, number][];
  const { type, coordinates } = feature.geometry;
  if (type === 'Polygon') {
    return (coordinates[0] ?? []) as [number, number][];
  }
  if (type === 'MultiPolygon') {
    return (coordinates[0]?.[0] ?? []) as [number, number][];
  }
  return [] as [number, number][];
}

function buildPath(points: [number, number][]) {
  if (points.length < 3) return '';
  const lngs = points.map((point) => point[0]);
  const lats = points.map((point) => point[1]);
  const minX = Math.min(...lngs);
  const maxX = Math.max(...lngs);
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const pad = 10;

  return points
    .map((point, index) => {
      const x = ((point[0] - minX) / width) * (100 - pad * 2) + pad;
      const y = (1 - (point[1] - minY) / height) * (100 - pad * 2) + pad;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ') + ' Z';
}

export default function MapComponent({ city }: MapComponentProps) {
  const mapX = ((city.longitude + 180) / 360) * 100;
  const mapY = ((90 - city.latitude) / 180) * 100;
  const palette = city.palette ?? ['#f9c5d5', '#c7ceea', '#b5ead7'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-full w-full overflow-hidden rounded-lg border border-border/50"
      style={{
        backgroundImage: `linear-gradient(135deg, ${palette[0]}, ${palette[1]}, ${palette[2]})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.4),transparent_35%)]" />

      <div className="absolute inset-0 opacity-35">
        <svg width="100%" height="100%" className="h-full w-full">
          <defs>
            <pattern id="pastel-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(80,80,120,0.18)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pastel-grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transform"
        style={{ left: `${mapX}%`, top: `${mapY}%` }}
      >
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.2, repeat: Infinity }} className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="absolute inset-0 h-10 w-10 animate-pulse rounded-full border-2 border-white/80" />
        </motion.div>
      </motion.div>

      <div className="absolute left-5 top-5 rounded-2xl border border-white/60 bg-white/72 p-3 shadow-sm backdrop-blur-md">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Snapshot warna pastel
        </div>
        <p className="max-w-xs text-xs text-muted-foreground">
          Area ini sekarang pakai visual yang lebih ringan biar dashboard terasa lebih hidup tapi tetap kalem.
        </p>
      </div>

      <div className="absolute right-5 top-5 rounded-full border border-white/60 bg-white/80 p-3 shadow-sm backdrop-blur-md">
        <Compass className="h-5 w-5 text-primary" />
      </div>

      <div className="absolute bottom-5 left-5 right-5 z-10 rounded-3xl border border-white/60 bg-white/82 p-4 shadow-lg backdrop-blur-md">
        <h3 className="mb-1 text-lg font-semibold text-foreground">{city.name}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{city.address}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-background/80 p-3">
            <p className="text-xs text-muted-foreground">Koordinat</p>
            <p className="text-sm font-semibold text-foreground">
              {city.latitude.toFixed(4)}°, {city.longitude.toFixed(4)}°
            </p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3">
            <p className="text-xs text-muted-foreground">Responden</p>
            <p className="text-sm font-semibold text-foreground">{Number(city.respondentCount).toLocaleString('id-ID')}</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3">
            <p className="text-xs text-muted-foreground">Estimasi Populasi</p>
            <p className="text-sm font-semibold text-foreground">{Number(city.totalPopulation).toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
