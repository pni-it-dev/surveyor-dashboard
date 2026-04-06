"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDemographics(cityId?: string) {
  const { data, error, isLoading } = useSWR(
    cityId ? `/api/demographics?cityId=${cityId}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // biar ga spam refetch
      dedupingInterval: 10000, // 10 detik cache
    },
  );

  return {
    data,
    isLoading,
    isError: error,
  };
}
