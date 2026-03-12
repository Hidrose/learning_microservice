import axios from "axios";
import { useState } from "react";
import type { OrderRequest } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";

export default function useAddOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const addOrder = async (data: OrderRequest) => {
    if (!data) {
      return;
    }
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/order/user`;
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addOrder, isLoading };
}
