import { memo } from "react";
import MessageList from "./MessageList";

function ChatBody() {
  return (
    <>
      <div className="flex flex-col flex-1 min-h-0">
        <MessageList />
      </div>
    </>
  );
}

export default memo(ChatBody);
