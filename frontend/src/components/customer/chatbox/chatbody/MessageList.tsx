import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

function MessageList() {
  const messages: {
    id: number;
    type: "user" | "ai";
    text: string;
    products?: any;
  }[] = [
    {
      id: 1,
      type: "ai",
      text: "Xin chào! Tôi là trợ lý tư vấn sản phẩm. Bạn đang tìm sản phẩm nào ạ?",
    },
    {
      id: 2,
      type: "user",
      text: "Bàn phím 1 còn hàng không?",
    },
    {
      id: 3,
      type: "ai",
      text: "Dạ, Bàn phím 1 hiện vẫn còn hàng với số lượng 5 sản phẩm. Giá hiện tại là 100.000₫. Bạn có thể tham khảo chi tiết bên dưới",
      products: [
        {
          id: 1,
          name: "Bàn phím 1",
          price: 100000,
          image: "/assets/categories/banphim.png",
          stock: 5,
        },
      ],
    },
    {
      id: 4,
      type: "user",
      text: "Ngoài bàn phím này còn loại nào tương tự không?",
    },
    {
      id: 5,
      type: "ai",
      text: "Dạ có ạ Dưới đây là một số sản phẩm tương tự mà bạn có thể quan tâm",
      products: [
        {
          id: 2,
          name: "Bàn phím 2",
          price: 95000,
          image: "/assets/categories/tainghe.png",
          stock: 5,
        },
        {
          id: 3,
          name: "Laptop 1",
          price: 12000000,
          image: "/assets/categories/laptop.png",
          stock: 5,
        },
        {
          id: 4,
          name: "Bàn phím 2",
          price: 95000,
          image: "/assets/categories/ghe.png",
          stock: 5,
        },
        {
          id: 5,
          name: "Laptop 1",
          price: 12000000,
          image: "/assets/categories/laptop.png",
          stock: 5,
        },
        {
          id: 6,
          name: "Laptop 1",
          price: 12000000,
          image: "/assets/categories/laptop.png",
          stock: 5,
        },
      ],
    },
    {
      id: 6,
      type: "user",
      text: "Nếu tôi mua thì giao hàng trong bao lâu?",
    },
    {
      id: 7,
      type: "ai",
      text: "Thời gian giao hàng dự kiến từ 2–4 ngày làm việc tùy khu vực. Bạn cần mình hỗ trợ đặt hàng không ạ?",
    },
  ];

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-4 text-[0.9rem] custom-scroll px-3 py-6">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          type={msg.type}
          text={msg.text}
          products={msg.products}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
