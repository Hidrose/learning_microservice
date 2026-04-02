import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { BrandRequest } from "../../../types/type";
import useGetBrand from "./useGetBrand";

export default function useUpdateBrand(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetBrand(id);
  const updateBrand = async (data: BrandRequest) => {
    if (!id) return;
    const loadingToast = toast.loading("Đang cập nhật...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/brand/${id}`;
      const res = await axios.put(url, data);
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

  return { updateBrand, isLoading };
}
