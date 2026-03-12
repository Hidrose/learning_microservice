import axios from "axios";
import { useState } from "react";
import type { CartItemRequest } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";
import toast from "react-hot-toast";

export function useChangeQuantityItemInCart() {
  const [isLoading, setIsLoading] = useState(false);

  const changeQuantity = async (userId: string, data: CartItemRequest) => {
    if (!userId || !data) {
      return;
    }
    const loadingToast = toast.loading("Đang cập nhật số lượng...");
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;

      await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Cập nhật số lượng thành công");
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { changeQuantity, isLoading };
}
