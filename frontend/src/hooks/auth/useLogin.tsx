import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    if (!data) return;

    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login`;
      const { data: res } = await axios.post(url, data);
      const { token, role } = res;

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


      navigate(role === "admin" ? "/admin/account/profile" : "/");
    } catch (err) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
}
