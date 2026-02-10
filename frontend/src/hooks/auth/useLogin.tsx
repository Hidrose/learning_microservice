import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!data) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      const res = await axios.post(url, data);
      const { token, role } = res.data;

      const isAdminPage = window.location.pathname.startsWith("/admin");

      if (!isAdminPage && role === "admin") {
        toast.error(
          "Bạn không thể đăng nhập bằng tài khoản quản trị viên vào trang khách hàng",
        );
        return;
      }

      if (isAdminPage && role === "customer") {
        toast.error(
          "Bạn không thể đăng nhập bằng tài khoản khách hàng vào trang quản trị viên",
        );
        return;
      }

      toast.success("Đăng nhập thành công");

      if (role === "customer") {
        Cookies.set("token-customer", token, {
          expires: 1,
          sameSite: "strict",
          secure: import.meta.env.VITE_ENV === "production",
        });
        window.location.href = "/";
      } else if (role === "admin") {
        Cookies.set("token-admin", token, {
          expires: 1,
          sameSite: "strict",
          secure: import.meta.env.VITE_ENV === "production",
        });
        window.location.href = "/admin/account/profile";
      }
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
