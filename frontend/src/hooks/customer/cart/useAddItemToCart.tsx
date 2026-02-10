import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { CartItemRequest } from "../../../types/type";

export function useAddItemToCart() {
  const [isLoading, setIsLoading] = useState(false);

  const addItem = async (data: CartItemRequest) => {
    if (!data) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;
      await axios.post(url, data);
      toast.success("Thêm vào giỏ hàng thành công");
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addItem, isLoading };
}
