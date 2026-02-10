import { memo } from "react";
import { LuSendHorizontal } from "react-icons/lu";

type Props = {
  textLength: number;
};

function ChatButton({ textLength }: Props) {
  const isDisabled = textLength === 0 || textLength > 1000; 
  return (
    <button
      disabled={isDisabled}
      className={`w-9 h-9 flex items-center justify-center rounded-full ${
        isDisabled ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white"
      } `}
    >
      <LuSendHorizontal size={18} />
    </button>
  );
}

export default memo(ChatButton);
