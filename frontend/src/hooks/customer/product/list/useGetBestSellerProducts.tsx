import axios from "axios";
import useSWR from "swr";
import type {
  ApiResponse,
  ProductListItemResponse,
} from "../../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetBestsellerProducts(limit: number) {
  const url = `${import.meta.env.VITE_BACKEND_URL}/product/active/bestseller?limit=${limit}`;

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<ProductListItemResponse[]>
  >(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    products: data?.data ?? [],
    isLoading,
    error,
    mutate,
  };
}
