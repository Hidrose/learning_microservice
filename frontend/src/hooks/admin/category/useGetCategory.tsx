import axios from "axios";
import useSWR from "swr";
import type { CategoryResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetCategory(id: string) {
  const url = id ? `${import.meta.env.VITE_BACKEND_URL}/category/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<CategoryResponse>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    category: data,
    isLoading,
    error,
    mutate,
  };
}
