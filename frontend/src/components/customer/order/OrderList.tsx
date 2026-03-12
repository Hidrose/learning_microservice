import { useNavigate, useSearchParams } from "react-router-dom";
import Image from "../../ui/Image";
import Pagination from "../ui/Pagination";
import OrderCard from "./OrderCard";
import useGetOrders from "../../../hooks/customer/order/useGetOrders";
import OrderListSkeleton from "../skeleton/OrderListSkeleton";

function OrderList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { orders, isLoading, totalItems, totalPages, currentPage } =
    useGetOrders();

  const array = [
    { status: "", name: "Tất cả" },
    { status: 0, name: "Chờ xác nhận" },
    { status: 1, name: "Xác nhận" },
    { status: 2, name: "Đang giao" },
    { status: 3, name: "Giao thành công" },
    { status: 4, name: "Đã hủy" },
    { status: 5, name: "Trả hàng" },
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (!isNaN(Number(status))) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-full flex-1 sm:px-[15px] px-[10px]">
      <div className="flex justify-between items-center mb-[20px]">
        <h2>Đơn hàng</h2>

        <select
          onChange={handleStatusChange}
          value={searchParams.get("status") ?? ""}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-[0.9rem] rounded-sm block p-2 outline-0"
        >
          {array.map((item) => (
            <option value={item.status} key={item.status}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-5 flex-col">
        {isLoading ? (
          <OrderListSkeleton count={2} />
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderCard order={order} />)
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col justify-center items-center gap-[15px]">
              <Image
                source={"/assets/empty-order.png"}
                alt={""}
                className={"w-[120px]"}
                loading="eager"
              />

              <h4>Không có đơn hàng nào</h4>
            </div>
          </div>
        )}

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}

export default OrderList;
