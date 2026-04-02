import axios from "axios";
import { useState } from "react";
import type { MessageRequest, MessageResponse } from "../../../types/type";
import { getCookie } from "../../../utils/cookieUtil";
import toast from "react-hot-toast";
import useGetChatMessages from "./useGetChatMessages";

export default function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useGetChatMessages();
  const sendMessage = async (data: MessageRequest) => {
    if (!data) {
      return;
    }

    const optimisticAssistantMessage: MessageResponse = {
      chatId: "ABC",
      id: `assistant-temp-${Date.now()}`,
      content: "Trợ lý ảo đang phản hồi...",
      role: "ASSISTANT",
      createdAt: new Date().toISOString(),
    };

    const optimisticMessage: MessageResponse = {
      chatId: "ABC",
      id: `temp-${Date.now()}`,
      content: data.content,
      role: "USER",
      createdAt: new Date().toISOString(),
    };

    mutate(
      (currentPages) => {
        if (!currentPages) return currentPages;
        const updatedPages = [...currentPages];
        updatedPages[0] = {
          ...updatedPages[0],
          data: [
            optimisticAssistantMessage,
            optimisticMessage,
            ...updatedPages[0].data,
          ],
        };
        return updatedPages;
      },
      { revalidate: false },
    );

    setIsLoading(true);
    try {
      const token = getCookie("token-customer");

      const url = `${import.meta.env.VITE_BACKEND_URL}/assistant/chat`;
      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await mutate();
    } catch (err: any) {
      await mutate();
      toast.error(err?.response?.data?.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading };
}
