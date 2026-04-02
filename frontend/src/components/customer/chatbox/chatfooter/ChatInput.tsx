import { forwardRef, memo } from "react";

type Props = {
  onInput: () => void;
  onSubmit: (e?: React.FormEvent) => void;
};

const ChatInput = forwardRef<HTMLTextAreaElement, Props>(
  ({ onInput, onSubmit }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };
    return (
      <textarea
        ref={ref}
        rows={1}
        onInput={onInput}
        onKeyDown={handleKeyDown}
        name="message"
        id="message"
        placeholder="Nhập nội dung..."
        className="px-3 py-3 flex-1 w-full resize-none overflow-y-auto max-h-[120px] border-0 text-[0.9rem] outline-0 bg-transparent"
      />
    );
  },
);

export default memo(ChatInput);
