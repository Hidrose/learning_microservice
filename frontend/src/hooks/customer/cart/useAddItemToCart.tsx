import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { CartItemRequest } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";
import useGetCart from "./useGetCart";

export function useAddItemToCart() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetCart();

  const addItem = async (data: CartItemRequest) => {
    if (!data) {
      return;
    }
    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;

      const res = await axios.post(url, data, {
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

  return { addItem, isLoading };
}
