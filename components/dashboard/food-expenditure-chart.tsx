"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
  isLoading?: boolean;
}

export function FoodExpenditureChart({ data = [], isLoading }: Props) {
  const sorted = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data],
  );

  const total = useMemo(
    () => sorted.reduce((s, d) => s + d.value, 0),
    [sorted],
  );

  const COLORS = ["#dc2626", "#ea580c", "#f59e0b", "#16a34a", "#2563eb"];

  if (isLoading) {
    return <div className="h-90 bg-muted animate-pulse rounded-lg" />;
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        const percent = total ? ((p.value / total) * 100).toFixed(1) : 0;

        return `<b>${p.name}</b><br/>Rp${p.value.toLocaleString("id-ID")} (${percent}%)`;
      },
    },

    grid: {
      left: 8,
      right: 16,
      top: 20,
      bottom: 8,
      containLabel: true, // 🔥 WAJIB
    },

    xAxis: {
      type: "category",
      data: sorted.map((d) => d.name),
      axisLabel: {
        rotate: 50, // penting biar ga tabrakan
      },
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        type: "bar",
        data: sorted.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: COLORS[Math.min(i, COLORS.length - 1)],
          },
        })),
        barMaxWidth: 40,
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle>Preferensi & Belanja Makan</CardTitle>
        </CardHeader>

        <CardContent className="h-90">
          <ReactECharts option={option} style={{ height: "100%" }} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
