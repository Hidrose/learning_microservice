import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useGetAdmins from "./useGetAdmins";
import useGetCustomers from "./useGetCustomers";

export default function useUpdateStatusUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateAdmins } = useGetAdmins();
  const { mutate: mutateCustomers } = useGetCustomers();
  const updateStatusUser = async (id: string, status: number) => {
    const action = status === 1 ? "chặn" : "bỏ chặn";
    const result = await Swal.fire({
      title: `Xác nhận ${action}?`,
      text: `Bạn có chắc muốn ${action} người dùng này không?`,
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
      }/user/status/${id}?status=${status}`;
      const res = await axios.patch(url);
      await Promise.all([mutateAdmins(), mutateCustomers()]);
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

  return { updateStatusUser, isLoading };
}
