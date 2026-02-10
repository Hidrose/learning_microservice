import axios from "axios";
import useSWR from "swr";
import type { UserResponse } from "../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetUser(id: string) {
  const url = id ? `${import.meta.env.VITE_BACKEND_URL}/user/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR<UserResponse>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    user: data,
    isLoading,
    error,
    mutate,
  };
}
