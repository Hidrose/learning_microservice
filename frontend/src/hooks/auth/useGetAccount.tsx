import axios from "axios";
import useSWR from "swr";
import Cookies from "js-cookie";
import type { ApiResponse, UserResponse } from "../../types/type";

const fetcher =
  (type: "admin" | "customer") =>
  async (url: string): Promise<UserResponse> => {
    const token =
      type === "admin"
        ? Cookies.get("token-admin")
        : Cookies.get("token-customer");

    if (!token) throw new Error("Token không tìm thấy");

    const res = await axios.get<ApiResponse<UserResponse>>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  };

export default function useGetAccount(type: "admin" | "customer") {
  const url = `${import.meta.env.VITE_BACKEND_URL}/auth/me`;

  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    [url, type],
    ([url]) => fetcher(type)(url),
  );

  return {
    account: data,
    isLoading,
    error,
    mutate,
  };
}
