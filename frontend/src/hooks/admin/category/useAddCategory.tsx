import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { CategoryRequest } from "../../../types/type";

export default function useAddCategory() {
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = async (data: CategoryRequest) => {
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

      if (data.image) {
        formData.append("image", data.image);
      }

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  return { addCategory, isLoading };
}
