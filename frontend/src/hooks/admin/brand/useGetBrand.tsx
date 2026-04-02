import axios from "axios";
import useSWR from "swr";
import type { BrandResponse, ApiResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetBrand(id: string) {
  const url = id ? `${import.meta.env.VITE_BACKEND_URL}/brand/${id}` : null;

    const { data, error, isLoading, mutate } = useSWR<
      ApiResponse<BrandResponse>
    >(url, fetcher, {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    });

  return {
    brand: data?.data,
    isLoading,
    error,
    mutate,
  };
}
