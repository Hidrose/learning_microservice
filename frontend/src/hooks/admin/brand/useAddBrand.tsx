import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BrandRequest } from "../../../types/type";
import useGetBrands from "./useGetBrands";

export default function useAddBrand() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetBrands();

  const addBrand = async (data: BrandRequest) => {
    if (!data) {
      return;
    }
    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/brand`;
      const res = await axios.post(url, data);

      await mutate();
      toast.dismiss(loadingToast);
      toast.success(res.data?.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { addBrand, isLoading };
}
