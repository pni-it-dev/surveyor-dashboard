"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/lib/filter-context";

interface Props {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

export function JobOccupationChart({ data = [], isLoading }: Props) {
  const { filters, updateFilter } = useFilters();

  const sorted = [...data].sort((a, b) => {
    const valA = a.value ?? 0;
    const valB = b.value ?? 0;

    if (valB !== valA) return valB - valA;

    const nameA = a.name ?? "";
    const nameB = b.name ?? "";
    return nameA.toLowerCase().localeCompare(nameB.toLowerCase(), "id-ID");
  });
  const total = sorted.reduce((a, b) => a + b.value, 0);

  const getColor = (index: number, total: number) => {
    const start = 80; // dark blue
    const end = 130; // light blue

    const ratio = index / (total - 1);
    const blue = Math.round(start + (end - start) * ratio);

    return `rgb(${blue - 20}, ${blue}, 255)`;
  };

  const handleClick = (params: any) => {
    const name = params.name;

    const next = filters.selectedJobOccupations.includes(name)
      ? filters.selectedJobOccupations.filter((j) => j !== name)
      : [...filters.selectedJobOccupations, name];

    updateFilter("selectedJobOccupations", next);
  };

  if (isLoading) {
    return <div className="h-80 bg-muted animate-pulse rounded-lg" />;
  }

  const option = {
    animation: true,
    animationDuration: 600,

    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const percent = ((p.value / total) * 100).toFixed(1);
        return `${p.name}<br/>${p.value.toLocaleString("id-ID")} (${percent}%)`;
      },
    },

    grid: {
      left: 160,
      right: 40,
      top: 20,
      bottom: 80, // tambahin space legend
    },

    xAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { show: true },
    },

    yAxis: {
      type: "category",
      inverse: true,
      data: sorted.map((d) => d.name),
      axisLine: { show: false },
      axisTick: { show: false },
    },

    legend: {
      show: true,
      bottom: 0,
      left: "center",
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        fontSize: 12,
      },
      data: ["Total Populasi"],
    },

    series: [
      {
        name: "Total Populasi",
        type: "bar",
        barWidth: 20,

        data: sorted.map((d, i) => {
          const isSelected = filters.selectedJobOccupations.includes(d.name);
          const dim = filters.selectedJobOccupations.length > 0 && !isSelected;

          return {
            value: d.value,
            name: d.name,
            itemStyle: {
              color: getColor(i, sorted.length),
              opacity: dim ? 0.3 : 1,
            },
          };
        }),

        itemStyle: {
          borderRadius: [0, 6, 6, 0],
        },

        label: {
          show: true,
          position: "right",
          distance: 10,
          formatter: (p: any) => {
            const percent = ((p.value / total) * 100).toFixed(1);
            return `${p.value.toLocaleString("id-ID")} (${percent}%)`;
          },
        },

        emphasis: {
          focus: "self",
          itemStyle: {
            opacity: 1,
            shadowBlur: 8,
            shadowColor: "rgba(0,0,0,0.15)",
          },
        },
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Tipe Pekerjaan</CardTitle>
        </CardHeader>

        <CardContent className="h-125">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
            onEvents={{ click: handleClick }}
            opts={{ renderer: "canvas" }}
            notMerge={true}
            lazyUpdate={true}
          />
        </CardContent>

        <p className="text-center text-xs text-muted-foreground">
          Scroll untuk lihat semua + klik bar untuk filter
        </p>
      </Card>
    </motion.div>
  );
}
