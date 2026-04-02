import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useGetProduct from "./useGetProduct";

export default function useDeleteImageProduct(productId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetProduct(productId);
  const deleteImageProduct = async (imageId: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa hình sản phẩm này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !productId || !imageId) return;

    const loadingToast = toast.loading("Đang xóa hình...");

    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/product/${productId}/image/${imageId}`;
      const res = await axios.delete(url);
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

  return { deleteImageProduct, isLoading };
}
