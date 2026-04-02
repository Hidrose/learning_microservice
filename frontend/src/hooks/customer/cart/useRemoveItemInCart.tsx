import axios from "axios";
import { useState } from "react";
import { getCookie } from "../../../utils/cookieUtil";
import { toast } from "react-hot-toast";
import useGetCart from "./useGetCart";

export function useRemoveItemInCart() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetCart();
  const removeItem = async (userId: string, productId: string) => {
    if (!userId || !productId) {
      return;
    }
    const loadingToast = toast.loading("Đang xóa...");
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`;

      const res = await axios.delete(url, {
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

  return { removeItem, isLoading };
}
