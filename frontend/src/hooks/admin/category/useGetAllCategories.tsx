import axios from "axios";
import useSWR from "swr";
import type { ApiResponse, CategoryResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetAllCategories() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/category/all`;

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<CategoryResponse[]>
  >(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    categories: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
}
