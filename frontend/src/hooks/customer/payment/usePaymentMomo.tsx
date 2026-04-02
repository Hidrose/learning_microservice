import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function usePaymentMomo() {
  const [isLoading, setIsLoading] = useState(false);
  const createPaymentMomo = async (orderCode: string) => {
    if (!orderCode) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/payment/momo/${orderCode}`;
      const res = await axios.post(url);
      return res.data.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPaymentMomo, isLoading };
}
