import { Link } from "react-router-dom";
import type { OrderResponse } from "../../../types/type";
import Image from "../../ui/Image";
import { CiCalendar } from "react-icons/ci";
import { memo } from "react";

type Props = {
  order: OrderResponse;
};

function OrderCard({ order }: Props) {
  return (
    <div className="border border-gray-300 px-[15px]" key={order.id}>
      <div className="space-y-[10px] py-[15px] border-b border-gray-300">
        <div className="flex justify-between flex-wrap gap-[10px]">
          <h5 className="font-semibold">Mã {order.orderCode}</h5>

          <p
            className={`font-medium ${
              order.status === 0
                ? "text-gray-500"
                : order.status === 1
                  ? "text-gray-500"
                  : order.status === 2
                    ? "text-gray-500"
                    : order.status === 3
                      ? "text-green-600"
                      : order.status === 4
                        ? "text-red-500"
                        : order.status === 5
                          ? "text-red-500"
                          : "text-gray-500"
            }`}
          >
            {order.status === 0
              ? "Chờ xác nhận"
              : order.status === 1
                ? "Xác nhận"
                : order.status === 2
                  ? "Đang giao"
                  : order.status === 3
                    ? "Giao thành công"
                    : order.status === 4
                      ? "Đã hủy"
                      : order.status === 5
                        ? "Trả hàng"
                        : ""}
          </p>
        </div>

        <div className="text-gray-500 font-medium flex items-center gap-1">
          <CiCalendar size={18} />{" "}
          <span>
            {new Date(order.createdAt).toLocaleString("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </span>
        </div>
      </div>

      {order.items.map((item, index) => (
        <div
          key={index}
          className="relative py-[15px] border-b border-gray-300 w-full"
        >
          <Link to={`/order/history/${order.orderCode}`}>
            <div className="flex items-center gap-[10px] w-full">
              <div className="w-[120px] h-[120px] overflow-hidden">
                <Image
                  source={`${item.images[0]}`}
                  alt={item.name}
                  className={"w-full h-full object-contain"}
                  loading="lazy"
                />
              </div>

              <div className="space-y-[15px]">
                <div className="flex gap-[10px] flex-wrap">
                  <h5 className="font-medium">{item.name}</h5>
                  <span>x{item.quantity}</span>
                </div>

                <div className="flex gap-[10px] flex-wrap font-medium">
                  {item.discount > 0 ? (
                    <>
                      <del>{item.price.toLocaleString("vi-VN")}₫</del>
                      <span className="font-medium text-accent">
                        {(item.price - item.discount).toLocaleString("vi-VN")}₫
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-accent">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}

      <div className="py-[15px]">
        <div className="flex justify-between items-center flex-wrap gap-[10px]">
          <h5 className="font-medium">
            Tổng tiền: {order.total.toLocaleString("vi-VN")}₫
          </h5>

          <Link
            to={`/order/history/${order.orderCode}`}
            className="text-white text-[0.9rem] font-medium px-[10px] py-[6px] bg-primary"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export default memo(OrderCard);
