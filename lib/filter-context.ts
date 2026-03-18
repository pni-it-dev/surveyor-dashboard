import { createContext, useContext } from 'react';

export interface FilterState {
  selectedCities: number[];
  selectedGenders: string[];
  selectedMaritalStatus: string[];
  selectedOccupationStatus: string[];
  selectedJobOccupations: string[];
  selectedAgeGroups: string[];
  selectedGenerations: string[];
  selectedSocioeconomic: string[];
  selectedIncomeRanges: string[];
  selectedFoodCategories: string[];
}

export interface FilterContextType {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, values: any[]) => void;
  clearFilters: () => void;
  isFilterActive: boolean;
}

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

export const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
