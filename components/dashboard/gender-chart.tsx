"use client";

import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/lib/filter-context";

interface GenderChartProps {
  data: {
    name: string;
    value: number;
  }[];
  isLoading: boolean;
}

const COLOR_MAP: Record<string, string> = {
  "LAKI LAKI": "#2563eb",
  PEREMPUAN: "#ec4899",
};

export function GenderChart({ data = [], isLoading }: GenderChartProps) {
  const { filters, updateFilter } = useFilters();

  const handleClick = (params: any) => {
    const name = params.name;

    const newGenders = filters.selectedGenders.includes(name)
      ? filters.selectedGenders.filter((g) => g !== name)
      : [...filters.selectedGenders, name];

    updateFilter("selectedGenders", newGenders);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Komposisi Gender</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const total = sortedData.reduce((acc, d) => acc + d.value, 0);

  const option = {
    animation: true,
    animationDuration: 600,

    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const percent = ((params.value / total) * 100).toFixed(1);
        return `
        <b>${params.name}</b><br/>
        ${params.value.toLocaleString("id-ID")} (${percent}%)
      `;
      },
    },

    legend: {
      show: true,
      bottom: 0,
      textStyle: { color: "#aaa" },
    },

    grid: {
      left: "5%",
      right: "5%",
      top: "10%",
      bottom: "15%",
      containLabel: true,
    },

    xAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: "dashed",
          opacity: 0.15,
        },
      },
    },

    yAxis: {
      type: "category",
      data: sortedData.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
    },

    series: [
      {
        name: "Total Populasi",
        type: "bar",
        barWidth: 26,

        data: sortedData.map((d) => {
          const isSelected = filters.selectedGenders.includes(d.name);
          const isDimmed = filters.selectedGenders.length > 0 && !isSelected;

          return {
            value: d.value,
            name: d.name,
            itemStyle: {
              color: COLOR_MAP[d.name] || "#888",
              opacity: isDimmed ? 0.3 : 1,
            },
          };
        }),

        label: {
          show: true,
          position: "right",
          fontSize: 12,
          color: "#ddd",
          formatter: (params: any) => {
            const percent = ((params.value / total) * 100).toFixed(1);
            return `${params.value.toLocaleString("id-ID")} (${percent}%)`;
          },
        },

        emphasis: {
          focus: "self",
          itemStyle: {
            opacity: 1,
          },
        },
      },
    ],
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Komposisi Gender</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <ReactECharts
            option={option}
            style={{ height: "100%" }}
            onEvents={{
              click: handleClick,
            }}
          />
          <p className="text-center text-xs text-muted-foreground">
            Klik bar untuk filter gender
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
