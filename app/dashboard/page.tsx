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
import { useDemographics } from "@/hooks/user-demographics";
import { useCities, City } from "@/hooks/use-cities";

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
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const { data: demographics, isLoading: isDemographicsLoading } =
    useDemographics(selectedCity?.id ?? undefined);
  const { data: cities, isLoading: isCitiesLoading } = useCities();

  useEffect(() => {
    if (cities?.cities?.length > 0 && selectedCity == null) {
      setSelectedCity(cities.cities[0]);
      setFilters((prev) => ({
        ...prev,
        selectedCities: [cities.cities[0].id],
      }));
    }
  }, [cities, selectedCity]);

  const updateFilter = (key: keyof FilterState, values: any[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    if (cities.cities.length > 0) {
      setSelectedCity(cities.cities[0]);
      setFilters((prev) => ({
        ...prev,
        selectedCities: [cities.cities[0].id],
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

  if (isCitiesLoading || isDemographicsLoading) {
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
          {selectedCity && (
            <CityInfo
              city={selectedCity}
              isLoading={cities?.cities?.length === 0}
            />
          )}

          {/* Filter Controls */}
          <div className="mt-8 mb-8">
            <FilterControls
              cities={cities?.cities}
              selectedCityId={selectedCity?.id}
              onCityChange={(cityId) => {
                setSelectedCity(
                  cities?.cities.find((city: City) => city.id === cityId) ||
                    null,
                );
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
              <MapChart data={demographics?.demographics} />
            </motion.div>
          )}

          {/* Demographics Summary & Gender Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <DemographicsSummary
                data={demographics?.demographics}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <GenderChart
                data={demographics?.genderBreakdown}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
          </div>

          {/* Marital Status & Occupation Status Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MaritalStatusChart
                data={demographics?.maritalStatusBreakdown}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <OccupationStatusChart
                data={demographics?.occupationStatusBreakdown}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
          </div>

          {/* Job Occupation Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <JobOccupationChart
              data={demographics?.jobOccupations}
              isLoading={isDemographicsLoading}
            />
          </motion.div>

          {/* Age Group Chart - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-8"
          >
            <AgeGroupChart
              data={demographics?.ageGroupData || []}
              isLoading={isDemographicsLoading}
            />
          </motion.div>

          {/* Socioeconomic, Income & Food Expenditure Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <SocioeconomicChart
                data={demographics?.socioeconomicData || []}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <IncomeChart
                data={demographics?.incomeData || []}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
            <motion.div
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <FoodExpenditureChart
                data={demographics?.foodExpenditureData || []}
                isLoading={isDemographicsLoading}
              />
            </motion.div>
          </div>

          {/* Points of Interest Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="mb-8"
          >
            <POISummary
              data={demographics?.pointsOfInterest ?? []}
              isLoading={isDemographicsLoading}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </FilterContext.Provider>
  );
}
