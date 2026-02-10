import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ProductRequest } from "../../../types/type";

export default function useAddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const addProduct = async (data: ProductRequest) => {
    if (!data) {
      return;
    }
    const loadingToast = toast.loading("Đang thêm...");
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/product`;
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

  return { addProduct, isLoading };
}
