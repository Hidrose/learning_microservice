import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function useUpdateStatusOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const updateStatusOrder = async (id: string, status: number) => {
    const result = await Swal.fire({
      title: `Xác nhận cập nhật trạng thái?`,
      text: `Bạn có chắc muốn cập nhật trạng thái đơn hàng này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !id) {
      return;
    }

    const loadingToast = toast.loading("Đang cập nhật...");

    setIsLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/order/status/${id}?status=${status}`;
      await axios.patch(url);

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

  return { updateStatusOrder, isLoading };
}
