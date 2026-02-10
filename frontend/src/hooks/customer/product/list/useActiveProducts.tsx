import axios from "axios";
import useSWR from "swr";
import type { ProductResponse } from "../../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetActiveProducts(limit: number) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/product/active/limit?limit=${limit}`;

  const { data, error, isLoading, mutate } = useSWR<ProductResponse[]>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    products: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
