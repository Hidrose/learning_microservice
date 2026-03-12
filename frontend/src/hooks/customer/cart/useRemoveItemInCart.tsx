import axios from "axios";
import { useState } from "react";
import { getCookie } from "../../../utils/cookieUtil";
import { toast } from "react-hot-toast";

export function useRemoveItemInCart() {
  const [isLoading, setIsLoading] = useState(false);

  const removeItem = async (userId: string, productId: string) => {
    if (!userId || !productId) {
      return;
    }
    const loadingToast = toast.loading("Đang xóa...");
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.dismiss(loadingToast);
      toast.success("Xóa khỏi giỏ hàng thành công");
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { removeItem, isLoading };
}
