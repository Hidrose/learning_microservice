import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ProductRequest } from "../../../types/type";

export default function useUpdateProduct(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const updateProduct = async (data: ProductRequest) => {
    if (!id) return;
    const loadingToast = toast.loading("Đang cập nhật...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/product/${id}`;
      const formData = new FormData();

      formData.append(
        "product",
        new Blob(
          [
            JSON.stringify({
              name: data.name,
              price: data.price,
              discount: data.discount,
              description: data.description,
              status: data.status,
              stock: data.stock,
              categoryId: data.categoryId,
              brandId: data.brandId,
              specifications: data.specifications,
            }),
          ],
          { type: "application/json" },
        ),
      );

      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.dismiss(loadingToast);
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { updateProduct, isLoading };
}
