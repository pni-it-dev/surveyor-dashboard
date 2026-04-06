"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Activity } from "lucide-react";
import { City } from "@/hooks/use-cities";

// Helper component for counting numbers
function AnimatedCounter({ value, duration = 1.2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10px" });
  
  useEffect(() => {
    if (!inView || !ref.current) return;
    
    let start = 0;
    const end = value;
    const startTime = performance.now();
    
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const updateCounter = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutQuart(progress);
      
      const currentVal = Math.round(start + (end - start) * easeProgress);
      if (ref.current) {
        ref.current.textContent = currentVal.toLocaleString("id-ID");
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }, [value, duration, inView]);

  return <span ref={ref}>{value.toLocaleString("id-ID")}</span>;
}

export function CityInfo({
  city,
  isLoading,
}: {
  city: City;
  isLoading: boolean;
}) {
  if (!city || isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm bg-card">
        <CardContent className="pt-0">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Column: Icon and Info */}
            <div className="flex items-center gap-4 lg:w-1/3">
              <div className="rounded-2xl bg-primary/10 p-4 shadow-sm border border-primary/20 shrink-0">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  {city.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {city.address}
                </p>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="flex flex-wrap items-start justify-start lg:justify-end gap-3 lg:w-2/3">
              <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 min-w-[140px] flex-1 lg:flex-initial">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Kode Wilayah
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {city.id}
                  </span>
                </div>
              </div>
              
              <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 min-w-[150px] flex-1 lg:flex-initial">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Responden
                    </span>
                  </div>
                  <span className="text-6xl font-semibold tracking-tight text-primary">
                    <AnimatedCounter value={Number(city.respondentCount)} />
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 min-w-[150px] flex-1 lg:flex-initial">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Est. Populasi
                    </span>
                  </div>
                  <span className="text-6xl font-semibold tracking-tight text-primary">
                    <AnimatedCounter value={Number(city.totalPopulation)} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
