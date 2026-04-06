"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-lg bg-muted">
      <p className="text-muted-foreground">Loading area snapshot...</p>
    </div>
  ),
});

interface MapChartProps {
  data: {
    kecamatan: string;
    geojson: Record<string, unknown> | null;
  };
}

export function MapChart({ data }: MapChartProps) {
  if (!data) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Area Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-lg bg-muted animate-pulse" />
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
      <Card className="overflow-hidden border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Area Snapshot - {data.kecamatan}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <MapComponent data={data} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
