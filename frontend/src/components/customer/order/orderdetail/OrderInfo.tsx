import Image from "../../../Image";
import Loading from "../../../Loading";
import { LuArchive, LuCheck, LuStar, LuTruck } from "react-icons/lu";
import { RiArrowLeftSLine } from "react-icons/ri";
import { TbCancel } from "react-icons/tb";
import { Link } from "react-router-dom";
import type { OrderResponse } from "../../../../types/type";

type Props = {
  order: OrderResponse;
  isLoading: boolean;
};

function OrderInfo({ order, isLoading }: Props) {
  const steps = [
    { label: "Chờ xác nhận", icon: <LuArchive size={24} /> },
    { label: "Xác nhận", icon: <LuCheck size={24} /> },
    { label: "Đang giao", icon: <LuTruck size={24} /> },
    { label: "Giao thành công", icon: <LuStar size={24} /> },
  ];
  return (
    <div className="w-full flex-1 border border-gray-300 text-black">
      {isLoading ? (
        <Loading height={70} size={50} color="black" thickness={3} />
      ) : (
        <div className=" pb-[20px]">
          <div className="flex justify-between px-[20px] py-[20px] border-b border-gray-300">
            <div className="flex flex-col gap-[8px]">
              <h4 className="uppercase">Đơn hàng</h4>

              <p className="font-medium">
                Mã: <span className="font-normal">{order?.orderCode}</span>
              </p>

              <p className="font-medium">
                Ngày:{" "}
                <span className="font-normal">
                  {order?.createdAt && (
                    <>
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}{" "}
                      {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </span>
              </p>
            </div>

            <Link to={"/order/history"} className="text-center">
              <span className="flex items-center font-semibold text-gray-600">
                <RiArrowLeftSLine size={20} /> Trở về
              </span>
            </Link>
          </div>

          {order?.status === 4 ? (
            <div className="relative flex items-center justify-center py-[20px] px-[20px] border-b border-gray-300">
              <span className="font-semibold text-center text-red-500 flex items-center gap-2">
                <TbCancel size={25} /> Đã hủy đơn hàng
              </span>
            </div>
          ) : order?.status === 5 ? (
            <div className="relative flex items-center justify-center py-[20px] px-[20px] border-b border-gray-300">
              <span className="font-semibold text-center text-red-500 flex items-center gap-2">
                <TbCancel size={25} /> Đã trả hàng
              </span>
            </div>
          ) : (
            <div className="relative gap-y-5 grid grid-cols-2 md:grid-cols-4 py-[20px] px-[20px] border-b border-gray-300">
              {steps.map((step, index) => {
                const isActive = (order?.status ?? -1) >= index;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center relative z-10 bg-white"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
                        isActive
                          ? "border-green-500 text-green-500"
                          : "border-gray-400 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`font-medium text-center ${
                        isActive ? " text-green-500" : ""
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-[20px]   space-y-[8px] py-[20px]">
            <h4 className="uppercase">Thông tin giao hàng</h4>

            <p className="font-medium">
              Họ tên: <span className="font-normal">{order?.fullname}</span>
            </p>

            <p className="font-medium">
              Số điện thoại: <span className="font-normal">{order?.phone}</span>
            </p>

            <p className="font-medium">
              Địa chỉ:{" "}
              <span className="font-normal">
                {order?.speaddress}
                {", "}
                {order?.city}
                {", "}
                {order?.ward}
              </span>
            </p>

            <p className="font-medium">
              Phương thức thanh toán:{" "}
              <span className="font-normal uppercase">{order?.paymethod}</span>
            </p>
          </div>

          <div className="w-full overflow-auto">
            <table className="w-[200%] border-collapse text-[0.9rem] sm:w-full">
              <thead>
                <tr className="text-left bg-[#F1F2F4]">
                  <th className="p-[20px]  ">Tiêu đề</th>
                  <th className="p-[20px]  ">Giá</th>
                  <th className="p-[20px]  ">Số lượng</th>
                  <th className="p-[20px]  ">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-[20px]  ">
                      <div className="flex items-center gap-[10px]">
                        <div className="w-[75px] h-[75px] overflow-hidden">
                          <Image
                            source={`${item.images[0]}`}
                            alt={""}
                            className={"w-full h-full object-contain"}
                            loading="eager"
                          />
                        </div>

                        <div className="space-y-[10px] font-medium">
                          <p>{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-[20px]  ">
                      {item.discount > 0 ? (
                        <div className="flex gap-[12px]  ">
                          <del className="text-[#707072] text-[1rem]">
                            {item.price.toLocaleString("vi-VN")}₫
                          </del>

                          <p className="font-medium text-[#FF424E]">
                            {(item.price - item.discount).toLocaleString(
                              "vi-VN",
                            )}
                            ₫
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {item.price.toLocaleString("vi-VN")}₫
                        </p>
                      )}
                    </td>
                    <td className="p-[20px]  ">x{item.quantity}</td>
                    <td className="p-[20px]  ">
                      {item.discount > 0
                        ? (
                            (item.price - item.discount) *
                            item.quantity
                          ).toLocaleString("vi-VN")
                        : (item.price * item.quantity).toLocaleString("vi-VN")}
                      ₫
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className="pl-[15px] sm:pl-[20px]">
                    <hr className="border border-black" />
                  </td>
                </tr>

                <tr className="text-[1rem] font-semibold">
                  <td className="p-[20px]  ">Tổng cộng:</td>
                  <td className="p-[20px]  ">
                    {order?.total.toLocaleString("vi-VN")}₫
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderInfo;
