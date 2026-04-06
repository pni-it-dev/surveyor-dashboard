"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: {
    ageGroup: string;
    generation: string;
    value: number;
  }[];
  isLoading: boolean;
}

const AGE_ORDER = [
  "0-5",
  "6-10",
  "11-15",
  "16-20",
  "21-25",
  "26-30",
  "31-35",
  "36-40",
  "41-45",
  "46-50",
  "51-55",
  "56-60",
  "60+",
];

const GENERATIONS = [
  "Gen Alpha",
  "Gen Z",
  "Millennials",
  "Gen X",
  "Boomer II",
  "Boomer I",
];

const BASE_COLORS: Record<string, string> = {
  "Gen Alpha": "#7c3aed", // ungu
  "Gen Z": "#16a34a", // ijo
  Millennials: "#2563eb", // biru
  "Gen X": "#eab308", // kuning
  "Boomer II": "#dc2626", // merah
  "Boomer I": "#7f1d1d", // maroon
};

function shadeColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;

  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);

  return `rgb(${r}, ${g}, ${b})`;
}

export function AgeGroupChart({ data = [], isLoading }: Props) {
  if (isLoading) {
    return <div className="h-96 bg-muted animate-pulse rounded-lg" />;
  }

  // 🔥 reshape data (IMPORTANT)
  const dataset = AGE_ORDER.map((age) => {
    const row: any = { ageGroup: age };

    GENERATIONS.forEach((gen) => {
      const found = data.find(
        (d) => d.ageGroup === age && d.generation === gen,
      );
      row[gen] = found?.value ?? 0;
    });

    return row;
  });

  const option = {
    animation: true,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const total = params.reduce((sum: number, p: any) => sum + p.value, 0);

        let html = `<b>${params[0].axisValue}</b><br/>`;
        params.forEach((p: any) => {
          const percent = total ? ((p.value / total) * 100).toFixed(1) : 0;
          html += `${p.marker} ${p.seriesName}: ${p.value.toLocaleString("id-ID")} (${percent}%)<br/>`;
        });

        html += `<hr/>Total: ${total.toLocaleString("id-ID")}`;
        return html;
      },
    },

    legend: {
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
    },

    grid: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 80,
    },

    xAxis: {
      type: "category",
      data: AGE_ORDER,
      axisLabel: {
        rotate: 30,
      },
    },

    yAxis: {
      type: "value",
    },

    series: GENERATIONS.map((gen) => ({
      name: gen,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },

      data: dataset.map((d, idx) => ({
        value: d[gen],

        itemStyle: {
          color: shadeColor(
            BASE_COLORS[gen],
            (idx - AGE_ORDER.length / 2) * 8, // 🔥 younger brighter, older darker
          ),
        },
      })),
    })),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Distribusi Usia & Generasi</CardTitle>
        </CardHeader>

        <CardContent className="h-105">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
          />
        </CardContent>

        <p className="text-center text-xs text-muted-foreground">
          Distribusi umur per 5 tahun dengan segmentasi generasi
        </p>
      </Card>
    </motion.div>
  );
}
