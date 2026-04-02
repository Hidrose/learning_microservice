import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { UserRequest } from "../types/type";
import useGetUser from "./useGetUser";

export default function useUpdateUser(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetUser(id);
  const updateUser = async (data: UserRequest) => {
    if (!id) return;
    const loadingToast = toast.loading("Đang cập nhật...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/${id}`;
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

  return { updateUser, isLoading };
}
