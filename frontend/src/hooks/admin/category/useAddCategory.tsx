import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { CategoryRequest } from "../../../types/type";
import useGetCategories from "./useGetCategories";

export default function useAddCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetCategories();

  const addCategory = async (data: CategoryRequest, file: File) => {
    if (!data) return;

    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/category`;

      const formData = new FormData();

      formData.append(
        "category",
        new Blob(
          [
            JSON.stringify({
              name: data.name,
              status: data.status,
            }),
          ],
          { type: "application/json" },
        ),
      );

      if (file) {
        formData.append("image", file);
      }

      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  return { addCategory, isLoading };
}
