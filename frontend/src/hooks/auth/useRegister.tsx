import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { UserRequest } from "../../types/type";

export default function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const handleRegister = async (data: UserRequest, otp: string) => {
    if (!data || !otp) {
      return;
    }

    const formData = {
      otp: {
        email: data.email,
        otp: otp,
      },
      user: {
        email: data.email,
        fullname: data.fullname,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        password: data.password,
        role: data.role,
        status: 1,
      },
    };

    setIsLoading(true);

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/auth/register`;
      const res = await axios.post(url, formData);
      toast.success(res.data?.message);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
}
