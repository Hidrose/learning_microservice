import axios from "axios";
import { useState } from "react";

export function useRemoveItemInCart() {
  const [isLoading, setIsLoading] = useState(false);

  const removeItem = async (userId: string, productId: string) => {
    if (!userId || !productId) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/cart/${productId}`;
      await axios.delete(url);
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { removeItem, isLoading };
}
