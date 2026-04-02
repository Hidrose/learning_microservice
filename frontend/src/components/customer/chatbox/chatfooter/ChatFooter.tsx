import { memo, useCallback, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import SendButton from "./SendButton";
import ToolTip from "../../ui/ToolTip";
import useSendMessage from "../../../../hooks/customer/chat/useSendMessage";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import toast from "react-hot-toast";
import ChatVoice from "./ChatVoice";
import { openAuthModal } from "../../../../redux/slices/AuthModalSlice";
import { useDispatch } from "react-redux";

function ChatFooter() {
  const dispatch = useDispatch();
  const [textLength, setTextLength] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { sendMessage, isLoading } = useSendMessage();
  const { account } = useGetAccount("customer");

  const handleInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";

    setTextLength(el.value.trim().length);
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const message = inputRef.current?.value?.trim();

    if (!message) {
      return;
    }

    if (!account?.id) {
      dispatch(openAuthModal("login"));
      toast.error("Bạn phải đăng nhập để nhắn tin với trợ lý ảo");
      return;
    }

    inputRef.current!.value = "";
    inputRef.current!.style.height = "auto";
    setTextLength(0);

    await sendMessage({
      content: message,
    });
  };

  return (
    <div className="border-t border-gray-200 px-3 py-3">
      <div
        className={`border border-gray-300 rounded-2xl transition-all flex items-center gap-2`}
      >
        <form onSubmit={handleSubmit} className="w-full">
          <ChatInput
            ref={inputRef}
            onInput={handleInput}
            onSubmit={handleSubmit}
          />

          <label
            htmlFor="message"
            className={`flex justify-between px-3 pb-3 items-center gap-2 flex-wrap`}
          >
            <div className="relative group">
              <ToolTip text={"Chép chính tả"} />

              <ChatVoice inputRef={inputRef} onInput={handleInput} />
            </div>

            <div className="relative group">
              {textLength > 1000 && <ToolTip text={"Tin nhắn quá dài"} />}

              <SendButton textLength={textLength} isLoading={isLoading} />
            </div>
          </label>
        </form>
      </div>
    </div>
  );
}

export default memo(ChatFooter);
