import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { UserRequest } from "../../../types/type";
import useGetAdmins from "./useGetAdmins";

export default function useAddAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetAdmins();
  const addAdmin = async (data: UserRequest) => {
    if (!data) {
      return;
    }
    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user`;
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

  return { addAdmin, isLoading };
}
