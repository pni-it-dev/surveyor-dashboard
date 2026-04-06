"use client";

import ReactECharts from "echarts-for-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFilters } from "@/lib/filter-context";

interface Props {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

export function MaritalStatusChart({ data = [], isLoading }: Props) {
  const { filters, updateFilter } = useFilters();

  const total = data.reduce((a, b) => a + b.value, 0);

  const handleClick = (params: any) => {
    const name = params.name;

    const next = filters.selectedMaritalStatus.includes(name)
      ? filters.selectedMaritalStatus.filter((s) => s !== name)
      : [...filters.selectedMaritalStatus, name];

    updateFilter("selectedMaritalStatus", next);
  };

  if (isLoading) {
    return <div className="h-80 bg-muted animate-pulse rounded-lg" />;
  }

  const option = {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => {
        const percent = ((p.value / total) * 100).toFixed(1);
        return `${p.name}<br/>${p.value.toLocaleString("id-ID")} (${percent}%)`;
      },
    },

    legend: {
      bottom: 0,
      type: "scroll",
    },

    series: [
      {
        name: "Marital",
        type: "pie",
        radius: ["40%", "80%"], // donut
        avoidLabelOverlap: true,

        data: data.map((d) => {
          const isSelected = filters.selectedMaritalStatus.includes(d.name);
          const dim = filters.selectedMaritalStatus.length > 0 && !isSelected;

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
          scaleSize: 6,
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
          <CardTitle>Status Pernikahan</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 min-h-60">
          <ReactECharts
            option={option}
            style={{ height: "100%" }}
            onEvents={{ click: handleClick }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
