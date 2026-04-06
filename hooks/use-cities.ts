"use client";

import useSWR from "swr";

export type City = {
  id: string;
  name: string;
  address: string;
  geojson: Record<string, unknown> | null;
  respondentCount: number;
  totalPopulation: number;
  totalHouseholds: number;
  latitude: number;
  longitude: number;
  palette: string[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCities() {
  const { data, error, isLoading } = useSWR(`/api/cities`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  return {
    data,
    isLoading,
    isError: error,
  };
}
