import { useCallback, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatVoice from "./ChatVoice";
import SendButton from "./SendButton";
import ToolTip from "../../ToolTip";

function ChatFooter() {
  const [textLength, setTextLength] = useState<number>(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";

    setTextLength(el.value.trim().length);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const message = inputRef.current?.value?.trim();

    if (!message) {
      return;
    }

    console.log(message);

    inputRef.current!.value = "";
    inputRef.current!.style.height = "auto";
    setTextLength(0);
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

              <SendButton textLength={textLength} />
            </div>
          </label>
        </form>
      </div>
    </div>
  );
}

export default ChatFooter;
