import axios from "axios";
import useSWR from "swr";
import type { CartResponse } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";

export default function useGetCart() {
  const token = getCookie("token-customer");

  const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR<CartResponse>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    cart: data,
    isLoading,
    error,
    mutate,
  };
}
