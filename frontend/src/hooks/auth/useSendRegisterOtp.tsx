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
      const res = await axios.post(url);
      toast.success(res.data?.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRegisterOTP, isLoading };
}
