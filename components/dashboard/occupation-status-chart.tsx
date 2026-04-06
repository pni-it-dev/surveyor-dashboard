"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/lib/filter-context";

interface Props {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

export function OccupationStatusChart({ data = [], isLoading }: Props) {
  const { filters, updateFilter } = useFilters();

  const total = data.reduce((a, b) => a + b.value, 0);

  const handleClick = (params: any) => {
    const name = params.name;

    const next = filters.selectedOccupationStatus.includes(name)
      ? filters.selectedOccupationStatus.filter((s) => s !== name)
      : [...filters.selectedOccupationStatus, name];

    updateFilter("selectedOccupationStatus", next);
  };

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const percent = ((p.value / total) * 100).toFixed(1);
        return `${p.name}<br/>${p.value.toLocaleString("id-ID")} (${percent}%)`;
      },
    },
    legend: { bottom: 0, type: "scroll" },

    series: [
      {
        name: "Occupation",
        type: "pie",
        radius: ["40%", "80%"],

        data: data.map((d) => {
          const isSelected = filters.selectedOccupationStatus.includes(d.name);
          const dim =
            filters.selectedOccupationStatus.length > 0 && !isSelected;

          return {
            ...d,
            itemStyle: {
              opacity: dim ? 0.3 : 1,
            },
          };
        }),

        label: {
          show: true,
          formatter: (p: any) => {
            const percent = ((p.value / total) * 100).toFixed(1);
            return `${p.name}\n${percent}%`;
          },
        },

        emphasis: {
          scale: true,
        },
      },
    ],
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Status Pekerjaan</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 min-h-60">
        <ReactECharts
          option={option}
          style={{ height: "100%" }}
          onEvents={{ click: handleClick }}
        />
      </CardContent>
    </Card>
  );
}
