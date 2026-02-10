import axios from "axios";
import { useState } from "react";
import type { CartItemRequest } from "../../../types/type";

export function useChangeQuantityItemInCart() {
  const [isLoading, setIsLoading] = useState(false);

  const changeQuantity = async (userId: string, data: CartItemRequest) => {
    if (!userId || !data) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cart`;
      await axios.put(url, data);
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { changeQuantity, isLoading };
}
