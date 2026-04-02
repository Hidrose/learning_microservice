import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { ProductRequest } from "../../../types/type";
import useGetProduct from "./useGetProduct";

export default function useUpdateProduct(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetProduct(id);
  const updateProduct = async (data: ProductRequest, files: File[]) => {
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

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.put(url, formData, {
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

  return { updateProduct, isLoading };
}
