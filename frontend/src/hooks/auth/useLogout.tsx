import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (type: "admin" | "customer") => {
    setIsLoading(true);

    try {
      if (type === "admin") {
        Cookies.remove("token-admin");
        navigate("/admin/login", { replace: true });
      } else {
        Cookies.remove("token-customer");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
}
