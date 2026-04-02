import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useGetAccount from "./useGetAccount";
import type { ApiResponse, LoginResponse } from "../../types/type";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateAccountCustomer } = useGetAccount("customer");
  const { mutate: mutateAccountAdmin } = useGetAccount("admin");
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!data) return;

    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      const { data: res } = await axios.post<ApiResponse<LoginResponse>>(
        url,
        data,
      );

      const { token, role } = res.data;

      const isAdminPage = window.location.pathname.startsWith("/admin");

      if (!isAdminPage && role === "admin") {
        toast.error("Không thể đăng nhập admin ở trang khách hàng");
        return;
      }

      if (isAdminPage && role === "customer") {
        toast.error("Không thể đăng nhập customer ở trang admin");
        return;
      }

      const cookieName =
        role === "admin"
          ? "token-admin"
          : role === "customer"
            ? "token-customer"
            : null;

      if (!cookieName) {
        return;
      }

      Cookies.set(cookieName, token, {
        expires: 1,
        sameSite: "strict",
        secure: import.meta.env.VITE_ENV === "production",
      });

      if (role === "admin") {
        await mutateAccountAdmin();
      } else {
        await mutateAccountCustomer();
      }

      toast.success(res.message);
      navigate(role === "admin" ? "/admin/account/profile" : "/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
