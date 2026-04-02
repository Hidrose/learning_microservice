import { memo, useCallback, useState } from "react";
import ChatBody from "./chatbody/ChatBody";
import ChatHeader from "./chatheader/ChatHeader";
import ChatFooter from "./chatfooter/ChatFooter";

type Props = {
  onClose: () => void;
};

function ChatContainer({ onClose }: Props) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-16">
      <div
        className={`bg-white pointer-events-auto shadow-xl flex flex-col transition-all duration-300 w-full h-full
    ${isExpanded ? "rounded-none" : "md:w-[600px] md:h-[580px] md:rounded-lg"}`}
      >
        <ChatHeader
          onClose={onClose}
          onExpand={toggleExpand}
          isExpanded={isExpanded}
        />
        <ChatBody  />
        <ChatFooter />
      </div>
    </div>
  );
}

export default memo(ChatContainer);
