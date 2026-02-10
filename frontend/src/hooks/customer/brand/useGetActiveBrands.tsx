import axios from "axios";
import useSWR from "swr";
import type { BrandResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetActiveBrands() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/brand/active`;

  const { data, error, isLoading, mutate } = useSWR<BrandResponse[]>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    brands: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
