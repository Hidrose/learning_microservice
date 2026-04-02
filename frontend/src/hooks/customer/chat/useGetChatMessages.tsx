import axios from "axios";
import useSWRInfinite from "swr/infinite";
import { getCookie } from "../../../utils/cookieUtil";
import type { ApiResponse, MessageResponse } from "../../../types/type";
import { useCallback } from "react";

export default function useGetChatMessages() {
  const token = getCookie("token-customer");
  const limit = 20;

  const { data, size, setSize, isLoading, mutate } = useSWRInfinite<
    ApiResponse<MessageResponse[]>
  >(
    (index) =>
      token
        ? `${import.meta.env.VITE_BACKEND_URL}/chat/user?page=${index + 1}&limit=${limit}&token=${token}`
        : null,
    (url) =>
      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.data),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateFirstPage: false,
    },
  );

  const messages = data
    ? [...data].reverse().flatMap((page) => [...page.data].reverse())
    : [];

  const totalPages = data?.[0]?.totalPages ?? 1;
  const hasMore = size < totalPages;

  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) setSize((s) => s + 1);
  }, [hasMore, isLoading, setSize]);

  return { messages, isLoading, hasMore, loadMore, mutate };
}
