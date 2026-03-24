'use client';

import { motion } from 'framer-motion';
import { Compass, MapPin } from 'lucide-react';

type GeoFeature = {
  type: 'Feature';
  geometry?: {
    type?: 'Polygon' | 'MultiPolygon';
    coordinates?: any;
  };
  properties?: Record<string, unknown>;
};

interface MapComponentProps {
  city: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
    respondentCount: number;
    totalPopulation: number;
    kabkotName?: string;
    geojsonData?: GeoFeature;
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
  const points = flattenCoordinates(city.geojsonData);
  const polygonPath = buildPath(points);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative h-[420px] w-full overflow-hidden rounded-lg border border-border/70 bg-card"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(220,40,40,0.09),rgba(220,40,40,0.02))]" />

      <div className="absolute inset-0 p-5">
        <svg viewBox="0 0 100 100" className="h-full w-full rounded-xl border border-border/70 bg-background/90">
          <defs>
            <pattern id="grid-red" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(220,40,40,0.12)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid-red)" />
          {polygonPath ? (
            <>
              <path d={polygonPath} fill="rgba(220,40,40,0.20)" stroke="#dc2828" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="1.8" fill="#dc2828" />
            </>
          ) : (
            <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" fill="currentColor" className="text-[4px]">
              GeoJSON belum tersedia
            </text>
          )}
        </svg>
      </div>

      <div className="absolute right-6 top-6 rounded-full border border-border/70 bg-background/95 p-2 text-primary shadow-sm">
        <Compass className="h-5 w-5" />
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl border border-border/70 bg-background/95 p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-semibold">{city.kabkotName ?? city.name}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <p className="text-muted-foreground">Koordinat: <span className="font-semibold text-foreground">{city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}</span></p>
          <p className="text-muted-foreground">Responden: <span className="font-semibold text-foreground">{Number(city.respondentCount).toLocaleString('id-ID')}</span></p>
          <p className="text-muted-foreground">Populasi: <span className="font-semibold text-foreground">{Number(city.totalPopulation).toLocaleString('id-ID')}</span></p>
        </div>
      </div>
    </motion.div>
  );
}
