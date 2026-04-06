"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface FilterControlsProps {
  cities: any[];
  selectedCityId: string | undefined;
  onCityChange: (cityId: string) => void;
  isFilterActive: boolean;
  onClearFilters: () => void;
}

export function FilterControls({
  cities,
  selectedCityId,
  onCityChange,
  isFilterActive,
  onClearFilters,
}: FilterControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg">Filter Controls</CardTitle>
            {/* {isFilterActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearFilters}
                className="flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80"
              >
                <X className="h-4 w-4" />
                Clear All
              </motion.button>
            )} */}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Pilih Kecamatan
            </label>
            <Select
              value={selectedCityId?.toString() || ""}
              onValueChange={(value) => onCityChange(value)}
            >
              <SelectTrigger className="w-full border-border/50 bg-background/90">
                <SelectValue placeholder="Pilih area..." />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
