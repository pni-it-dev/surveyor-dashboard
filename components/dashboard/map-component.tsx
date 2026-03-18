'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  city: {
    latitude: number;
    longitude: number;
    geojsonData: any;
    name: string;
  };
}

export default function MapComponent({ city }: MapComponentProps) {
  // Calculate map position based on coordinates
  const mapX = ((city.longitude + 180) / 360) * 100;
  const mapY = ((90 - city.latitude) / 180) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative"
    >
      {/* Map grid background */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Latitude/Longitude lines */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        {/* Longitude lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`lon-${i}`}
            className="absolute top-0 bottom-0 w-px bg-slate-400 dark:bg-slate-600"
            style={{ left: `${(i + 1) * 11.11}%` }}
          />
        ))}
        {/* Latitude lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`lat-${i}`}
            className="absolute left-0 right-0 h-px bg-slate-400 dark:bg-slate-600"
            style={{ top: `${(i + 1) * 11.11}%` }}
          />
        ))}
      </div>

      {/* City marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ left: `${mapX}%`, top: `${mapY}%` }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-primary opacity-60 animate-pulse" />
        </motion.div>
      </motion.div>

      {/* Location info */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 z-10 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-foreground mb-1">{city.name}</h3>
        <p className="text-sm text-muted-foreground">
          Lat: {city.latitude.toFixed(4)}° Lon: {city.longitude.toFixed(4)}°
        </p>
      </div>

      {/* Compass rose */}
      <div className="absolute top-4 right-4 w-12 h-12 z-10">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full text-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <circle cx="50" cy="50" r="45" fill="white" stroke="currentColor" strokeWidth="2" opacity="0.8" className="dark:fill-slate-800" />
          <path d="M 50 10 L 55 35 L 50 30 L 45 35 Z" fill="currentColor" />
          <text x="50" y="25" textAnchor="middle" className="text-xs font-bold fill-current">N</text>
        </motion.svg>
      </div>
    </motion.div>
  );
}
