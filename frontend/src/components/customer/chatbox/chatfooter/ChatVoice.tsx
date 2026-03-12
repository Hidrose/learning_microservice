import { memo } from "react";
import { LuMic } from "react-icons/lu";
import { RiVoiceAiLine } from "react-icons/ri";
import { useVoice } from "../../../../hooks/customer/useVoice";

type Props = {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput: () => void;
};

function ChatVoice({ inputRef, onInput }: Props) {
  const { recording, startVoice, stopVoice } = useVoice({
    inputRef,
    onInput,
  });

  return (
    <button
      type="button"
      onClick={recording ? stopVoice : startVoice}
      className={`w-9 h-9 flex items-center justify-center rounded-full ${
        recording ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {recording ? <RiVoiceAiLine size={18} /> : <LuMic size={18} />}
    </button>
  );
}

export default memo(ChatVoice);
