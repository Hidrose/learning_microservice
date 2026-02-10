import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BrandRequest } from "../../../types/type";

export default function useAddBrand() {
  const [isLoading, setIsLoading] = useState(false);
  const addBrand = async (data: BrandRequest) => {
    if (!data) {
      return;
    }
    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/brand`;
      await axios.post(url, data);
      toast.dismiss(loadingToast);
      toast.success("Thêm thành công");
    } catch (err) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { addBrand, isLoading };
}