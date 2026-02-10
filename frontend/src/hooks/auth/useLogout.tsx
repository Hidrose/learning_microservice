import Cookies from "js-cookie";
import { useState } from "react";

export default function useLogout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (type: "admin" | "customer") => {
    setIsLoading(true);
    try {
      if (type === "admin") {
        Cookies.remove("token-admin");
        window.location.href = "/admin/login";
      } else if (type === "customer") {
        Cookies.remove("token-customer");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
}
