import axios from "axios";
import { useState } from "react";
import type { CartItemRequest } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";
import toast from "react-hot-toast";
import useGetCart from "./useGetCart";

export function useChangeQuantityItemInCart() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetCart();

  const changeQuantity = async (userId: string, data: CartItemRequest) => {
    if (!userId || !data) {
      return;
    }
    const loadingToast = toast.loading("Đang cập nhật số lượng...");
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;

      const res = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await mutate();

      toast.dismiss(loadingToast);
      toast.success(res.data?.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { changeQuantity, isLoading };
}
