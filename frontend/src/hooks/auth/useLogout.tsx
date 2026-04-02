import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetAccount from "./useGetAccount";
import useGetChatMessages from "../customer/chat/useGetChatMessages";

export default function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: mutateAccountCustomer } = useGetAccount("customer");
  const { mutate: mutateAccountAdmin } = useGetAccount("admin");
  const { mutate: mutateChatMessages } = useGetChatMessages();
  const navigate = useNavigate();

  const handleLogout = async (type: "admin" | "customer") => {
    setIsLoading(true);
    try {
      if (type === "admin") {
        Cookies.remove("token-admin");
        await mutateAccountAdmin(undefined, { revalidate: false });
        navigate("/admin/login", { replace: true });
      } else {
        Cookies.remove("token-customer");
        await mutateAccountCustomer(undefined, { revalidate: false });
        await mutateChatMessages([], false);
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
