import { useSearchParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import type { ApiResponse, OrderResponse } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";

export default function useGetOrders() {
  const [searchParams] = useSearchParams();

  const token = getCookie("token-customer");

  if (!token) {
    throw new Error("Vui lòng đăng nhập");
  }

  const page = parseInt(searchParams.get("page") || "1", 10);
  const status = searchParams.get("status");

  const query = new URLSearchParams();
  if (page) query.set("page", page.toString());
  if (status) query.set("status", status.toString());

  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/order/user?${query.toString()}`;

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<OrderResponse[]>
  >(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    orders: data?.data ?? [],
    totalPages: data?.totalPages || 1,
    totalItems: data?.total || 0,
    currentPage: page,
    isLoading,
    error,
    mutate,
  };
}
