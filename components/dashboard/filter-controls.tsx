'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

interface FilterControlsProps {
  cities: any[];
  selectedCityId: number | null;
  onCityChange: (cityId: number) => void;
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
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filter Controls</CardTitle>
            {isFilterActive && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearFilters}
                className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <X className="h-4 w-4" />
                Clear All
              </motion.button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Select City
            </label>
            <Select
              value={selectedCityId?.toString() || ''}
              onValueChange={(value) => onCityChange(parseInt(value))}
            >
              <SelectTrigger className="w-full border-border/50">
                <SelectValue placeholder="Choose a city..." />
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

          <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Click on chart elements to apply global filters. All charts will update dynamically based on your selections.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
