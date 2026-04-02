import axios from "axios";
import useSWR from "swr";
import type { ApiResponse, OrderResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetOrder(id: string) {
  const url = id ? `${import.meta.env.VITE_BACKEND_URL}/order/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<OrderResponse>
  >(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    order: data?.data,
    isLoading,
    error,
    mutate,
  };
}
