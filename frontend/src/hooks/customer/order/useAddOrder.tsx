import axios from "axios";
import { useState } from "react";
import type {
  ApiResponse,
  OrderRequest,
  OrderResponse,
} from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";
import useGetCart from "../cart/useGetCart";
import toast from "react-hot-toast";
import useGetOrders from "./useGetOrders";

export default function useAddOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateCart } = useGetCart();
  const { mutate: mutateOrders } = useGetOrders();
  const addOrder = async (data: OrderRequest) => {
    if (!data) {
      return;
    }
    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      if (!token) {
        throw new Error("Vui lòng đăng nhập");
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/order/user`;
      const res = await axios.post<ApiResponse<OrderResponse>>(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.paymethod === "cod") {
        await mutateCart();
        await mutateOrders();
      }

      return res.data.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { addOrder, isLoading };
}
