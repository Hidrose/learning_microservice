import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useGetOrders from "./useGetOrders";
import useGetOrder from "./useGetOrder";

export default function useUpdateStatusOrder(id?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateOrder } = useGetOrder(id || "");
  const { mutate: mutateOrders } = useGetOrders();
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
      const res = await axios.patch(url);
      await mutateOrder?.();
      await mutateOrders?.();

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

  return { updateStatusOrder, isLoading };
}
