import axios from "axios";
import useSWR from "swr";
import { useState } from "react";
import type { ProductResponse } from "../../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetSuggestionProducts(limit: number) {
  const [keyword, setKeyword] = useState<string>("");
  const url = `${import.meta.env.VITE_BACKEND_URL}/product/active/limit?q=${keyword}&limit=${limit}`;

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
    setKeyword,
    isLoading,
    error,
    mutate,
  };
}
