"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { FilterContext, FilterState } from "@/lib/filter-context";
import { CityInfo } from "@/components/dashboard/city-info";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { MapChart } from "@/components/dashboard/map-chart";
import { DemographicsSummary } from "@/components/dashboard/demographics-summary";
import { GenderChart } from "@/components/dashboard/gender-chart";
import { MaritalStatusChart } from "@/components/dashboard/marital-status-chart";
import { OccupationStatusChart } from "@/components/dashboard/occupation-status-chart";
import { JobOccupationChart } from "@/components/dashboard/job-occupation-chart";
import { AgeGroupChart } from "@/components/dashboard/age-group-chart";
import { SocioeconomicChart } from "@/components/dashboard/socioeconomic-chart";
import { IncomeChart } from "@/components/dashboard/income-chart";
import { FoodExpenditureChart } from "@/components/dashboard/food-expenditure-chart";
import { POISummary } from "@/components/dashboard/poi-summary";
import { Footer } from "@/components/footer";

const defaultFilters: FilterState = {
  selectedCities: [],
  selectedGenders: [],
  selectedMaritalStatus: [],
  selectedOccupationStatus: [],
  selectedJobOccupations: [],
  selectedAgeGroups: [],
  selectedGenerations: [],
  selectedSocioeconomic: [],
  selectedIncomeRanges: [],
  selectedFoodCategories: [],
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [cities, setCities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const data = await response.json();
        setCities(data.cities || []);

        // Set first city as default
        if (data.cities && data.cities.length > 0) {
          setSelectedCity(data.cities[0].id);
          setFilters((prev) => ({
            ...prev,
            selectedCities: [data.cities[0].id],
          }));
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const updateFilter = (key: keyof FilterState, values: any[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    if (cities.length > 0) {
      setSelectedCity(cities[0].id);
      setFilters((prev) => ({
        ...prev,
        selectedCities: [cities[0].id],
      }));
    }
  };

  const isFilterActive = Object.values(filters).some(
    (value) => Array.isArray(value) && value.length > 0,
  );

  const filterContextValue = {
    filters,
    updateFilter,
    clearFilters,
    isFilterActive,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <FilterContext.Provider value={filterContextValue}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* City Info */}
          {selectedCity && cities.length > 0 && (
            <CityInfo cityId={selectedCity} />
          )}

          {/* Filter Controls */}
          <div className="mt-8 mb-8">
            <FilterControls
              cities={cities}
              selectedCityId={selectedCity}
              onCityChange={(cityId) => {
                setSelectedCity(cityId);
                updateFilter("selectedCities", [cityId]);
              }}
              isFilterActive={isFilterActive}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Map Chart - Full Width */}
          {selectedCity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <MapChart cityId={selectedCity} />
            </motion.div>
          )}

          {/* Demographics Summary & Gender Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <DemographicsSummary cityId={selectedCity} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GenderChart cityId={selectedCity} />
            </motion.div>
          </div>

          {/* Marital Status & Occupation Status Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MaritalStatusChart cityId={selectedCity} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <OccupationStatusChart cityId={selectedCity} />
            </motion.div>
          </div>

          {/* Job Occupation Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <JobOccupationChart cityId={selectedCity} />
          </motion.div>

          {/* Age Group Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-8"
          >
            <AgeGroupChart cityId={selectedCity} />
          </motion.div>

          {/* Socioeconomic, Income & Food Expenditure Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <SocioeconomicChart cityId={selectedCity} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <IncomeChart cityId={selectedCity} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <FoodExpenditureChart cityId={selectedCity} />
            </motion.div>
          </div>

          {/* Points of Interest Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="mb-8"
          >
            <POISummary cityId={selectedCity} />
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </FilterContext.Provider>
  );
}
