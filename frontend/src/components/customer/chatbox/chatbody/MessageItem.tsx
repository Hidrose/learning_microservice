import toast from "react-hot-toast";
import Image from "../../../ui/Image";
import MessageAction from "./MessageAction";
import { memo, useCallback } from "react";
import MessageProductList from "./MessageProductList";
import type { ProductListItemResponse } from "../../../../types/type";

type props = {
  role: "ASSISTANT" | "USER";
  content: string;
  products?: ProductListItemResponse[];
};

function MessageItem({ role, content, products }: props) {
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Đã sao chép tin nhắn");
  }, [content]);

  return (
    <div
      className={`flex gap-2 ${
        role === "ASSISTANT" ? "justify-start" : "justify-end"
      }`}
    >
      {role === "ASSISTANT" && (
        <Image
          className="w-10 h-10 rounded-full self-start"
          source="/assets/troly.png"
          alt="troly"
          loading="lazy"
        />
      )}

      <div
        className={`flex flex-col max-w-[75%] gap-2 ${
          role === "ASSISTANT" ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-xl break-anywhere whitespace-pre-wrap ${
            role === "ASSISTANT"
              ? "bg-gray-100 text-black"
              : "bg-primary text-white"
          }`}
        >
          {role === "ASSISTANT" ? (
            <span
              dangerouslySetInnerHTML={{ __html: content }}
              className="[&_a]:text-primary [&_a]:underline"
            />
          ) : (
            content
          )}
        </div>

        {role === "ASSISTANT" && products && (
          <MessageProductList products={products} />
        )}

        <MessageAction onCopy={handleCopy} />
      </div>
    </div>
  );
}

export default memo(MessageItem);
