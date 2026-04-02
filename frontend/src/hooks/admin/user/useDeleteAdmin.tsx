import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useGetAdmins from "./useGetAdmins";

export default function useDeleteAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetAdmins();
  const deleteAdmin = async (id: string) => {
    const result = await Swal.fire({
      title: `Xác nhận xóa?`,
      text: `Bạn có chắc muốn xóa quản trị viên này không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed || !id) return;

    const loadingToast = toast.loading("Đang xóa...");

    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/user/${id}`;
      const res = await axios.delete(url);
      await mutate();
      toast.dismiss(loadingToast);
      toast.success(res.data?.message);
    }  catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
    }
  };

  return { deleteAdmin, isLoading };
}
