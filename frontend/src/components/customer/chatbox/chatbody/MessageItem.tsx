import toast from "react-hot-toast";
import Image from "../../../Image";
import MessageAction from "./MessageAction";
import { memo, useCallback } from "react";
import MessageProductList from "./MessageProductList";

type props = {
  type: "user" | "ai";
  text: string;
  products?: any[];
};

function MessageItem({ type, text, products }: props) {
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Đã sao chép tin nhắn");
  }, [text]);

  return (
    <div
      className={`flex gap-2 ${
        type === "ai" ? "justify-start" : "justify-end"
      }`}
    >
      {type === "ai" && (
        <Image
          className="w-10 h-10 rounded-full self-start"
          source="/assets/troly.png"
          alt="troly"
          loading="lazy"
        />
      )}

      <div
        className={`flex flex-col max-w-[75%] gap-2 ${
          type === "ai" ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-xl break-anywhere whitespace-pre-wrap   ${
            type === "ai" ? "bg-gray-100 text-black" : "bg-blue-500 text-white"
          }
      `}
        >
          {text}
        </div>

        {type === "ai" && products && (
          <MessageProductList products={products} />
        )}

        {type === "ai" && <MessageAction onCopy={handleCopy} />}
      </div>
    </div>
  );
}

export default memo(MessageItem);
