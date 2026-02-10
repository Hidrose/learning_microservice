import axios from "axios";
import useSWR from "swr";
import type { CategoryResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetActiveCategories() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/category/active`;

  const { data, error, isLoading, mutate } = useSWR<CategoryResponse[]>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    categories: data ?? [],
    isLoading,
    error,
    mutate,
  };
}
