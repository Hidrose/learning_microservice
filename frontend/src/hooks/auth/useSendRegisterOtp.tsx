import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export function useSendRegisterOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const sendRegisterOTP = async (email: string) => {
    if (!email) {
      return;
    }
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/otp?email=${email}`;
      await axios.post(url);
      toast.success("Gửi mã OTP thành công. Vui lòng kiểm tra email của bạn");
    } catch (err: any) {
      console.error("Lỗi:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRegisterOTP, isLoading };
}
