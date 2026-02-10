import axios from "axios";
import useSWR from "swr";
import type { CartResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetCart() {
  const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;

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
