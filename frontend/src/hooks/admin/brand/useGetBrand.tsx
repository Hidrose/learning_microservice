import axios from "axios";
import useSWR from "swr";
import type { BrandResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetBrand(id: string) {
  const url = id ? `${import.meta.env.VITE_BACKEND_URL}/brand/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<BrandResponse>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    brand: data,
    isLoading,
    error,
    mutate,
  };
}
