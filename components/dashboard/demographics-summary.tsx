"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Soup, Users, Users2 } from "lucide-react";

interface DemographicsSummaryProps {
  data: {
    kecamatan: string;
    respondentCount: number;
    totalHouseholds: number;
    totalPopulation: number;
    avgHouseholdSize: number;
    averageAge: number;
    averageMonthlyFoodExpenditure: number;
  };
  isLoading: boolean;
}

interface DemoData {
  totalPopulation: number;
  totalHouseholds: number;
  avgHouseholdSize: number;
  averageMonthlyFoodExpenditure: number;
}

export function DemographicsSummary({
  data,
  isLoading,
}: DemographicsSummaryProps) {
  if (!data || isLoading) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Demografi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: Users,
      label: "Total Populasi",
      value: data.totalPopulation.toLocaleString("id-ID"),
    },
    {
      icon: Home,
      label: "Total Rumah Tangga",
      value: data.totalHouseholds.toLocaleString("id-ID"),
    },
    {
      icon: Users2,
      label: "Rata-rata Anggota KK",
      value: data.avgHouseholdSize.toFixed(2),
    },
    {
      icon: Soup,
      label: "Rata-rata Belanja Makan / Bulan",
      value: `Rp${Math.round(data.averageMonthlyFoodExpenditure).toLocaleString("id-ID")}`,
    },
  ];

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Demografi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-muted/60 to-secondary/40 p-3 transition-colors hover:from-muted hover:to-secondary/70"
                  >
                    <div className="rounded-2xl bg-primary/12 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
