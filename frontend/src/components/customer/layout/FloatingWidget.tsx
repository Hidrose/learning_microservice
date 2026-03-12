import { useCallback, useState } from "react";
import Image from "../../ui/Image";
import ChatContainer from "../chatbox/ChatContainer";
import Overplay from "../ui/Overplay";

function FloatingWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {isOpen && <ChatContainer onClose={toggleChat} />}

      <div className="fixed bottom-[15px] right-[15px] z-97">
        <button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full shadow-lg bg-primary flex items-center justify-center"
        >
          <Image
            source="/assets/chat-box.png"
            alt="chat"
            className="w-7 h-7"
            loading="eager"
          />
        </button>
      </div>

      {isOpen && <Overplay onClose={toggleChat} IndexForZ={96} />}
    </>
  );
}

export default FloatingWidget;
