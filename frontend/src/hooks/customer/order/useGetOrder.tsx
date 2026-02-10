import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetOrder(userId: string, orderCode: string) {
  const url =
    userId && orderCode
      ? `${
          import.meta.env.VITE_BACKEND_URL
        }/order/user/${orderCode}`
      : null;
  const { data, error, isLoading, mutate } = useSWR<any>(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    order: data,
    isLoading,
    error,
    mutate,
  };
}
