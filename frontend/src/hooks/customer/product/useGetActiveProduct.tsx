import axios from "axios";
import useSWR from "swr";
import type { ApiResponse, ProductDetailResponse } from "../../../types/type";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetActiveProduct(slug: string) {
  const url = slug
    ? `${import.meta.env.VITE_BACKEND_URL}/product/active/slug/${slug}`
    : null;
  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<ProductDetailResponse>
  >(url, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  return {
    product: data?.data,
    isLoading,
    error,
    mutate,
  };
}
