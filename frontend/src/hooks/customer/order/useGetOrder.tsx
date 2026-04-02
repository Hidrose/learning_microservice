import axios from "axios";
import useSWR from "swr";
import { getCookie } from "../../../utils/cookieUtil";
import type { ApiResponse, OrderResponse } from "../../../types/type";

export default function useGetOrder(orderCode: string) {
  const token = getCookie("token-customer");

  const url = orderCode
    ? `${import.meta.env.VITE_BACKEND_URL}/order/user/${orderCode}`
    : null;

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<OrderResponse>>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    order: data?.data,
    isLoading,
    error,
    mutate,
  };
}
