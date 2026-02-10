import { useLocation } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import type { ProductResponse } from "../../../../types/type";

interface ResponseType {
  products: ProductResponse[];
  totalPages: number;
  total: number;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useGetActiveDiscountProducts() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const q = searchParams.get("q");
  const sort = searchParams.get("sort");

  const query = new URLSearchParams();
  if (page) query.set("page", page.toString());
  if (q) query.set("q", q || "");
  if (sort) query.set("sort", sort || "");

  const url = `${
    import.meta.env.VITE_BACKEND_URL
  }/product/active/discount?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<ResponseType>(
    url,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  return {
    products: data?.products ?? [],
    totalPages: data?.totalPages || 1,
    totalItems: data?.total || 0,
    currentPage: page,
    isLoading,
    error,
    mutate,
  };
}
