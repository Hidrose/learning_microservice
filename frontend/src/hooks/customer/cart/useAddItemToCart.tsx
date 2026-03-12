import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { CartItemRequest } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";

export function useAddItemToCart() {
  const [isLoading, setIsLoading] = useState(false);

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

      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.dismiss(loadingToast);
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { addItem, isLoading };
}
