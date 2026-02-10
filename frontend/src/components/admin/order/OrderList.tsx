import { LiaExternalLinkAltSolid } from "react-icons/lia";
import Image from "../../Image";
import Pagination from "../Pagination";
import FilterDropDownMenu from "../FilterDropDownMenu";
import InputSearch from "../InputSearch";
import Loading from "../../Loading";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import useGetOrders from "../../../hooks/admin/order/useGetOrders";
import useUpdateStatusOrder from "../../../hooks/admin/order/useUpdateStatusOrder";
import toast from "react-hot-toast";
function OrderList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    orders,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    limit,
    mutate,
  } = useGetOrders();
  const { updateStatusOrder, isLoading: isLoadingUpdate } =
    useUpdateStatusOrder();

  const handleUpdateStatus = async (id: string, status: number) => {
    if (!id && !status) {
      return;
    }
    try {
      await updateStatusOrder(id, status);
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      mutate();
    }
  };

  const array = [
    { name: "Tất cả", value: null },
    { name: "Chờ thanh toán", value: -1 },
    { name: "Chờ xác nhận", value: 0 },
    { name: "Xác nhận", value: 1 },
    { name: "Đang giao", value: 2 },
    { name: "Giao thành công", value: 3 },
    { name: "Đã hủy", value: 4 },
    { name: "Trả hàng", value: 5 },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const start = formData.get("start") as string;
    const end = formData.get("end") as string;

    const params = new URLSearchParams(searchParams.toString());

    if (start) params.set("start", start);
    else params.delete("start");

    if (end) params.set("end", end);
    else params.delete("end");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <ListHeader title="Đơn hàng" totalItems={totalItems} />

      <div className="py-[1.3rem] px-[1.2rem] bg-[#f1f4f9]">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-[15px] flex-wrap">
            <div className="relative flex gap-1.5 items-center">
              <label htmlFor="" className="text-[0.9rem]   font-medium">
                Từ:
              </label>
              <input
                required
                name="start"
                type="date"
                className="bg-gray-50 border border-gray-300 text-[0.9rem] p-[6px_10px] outline-none focus:border-gray-400  "
              />
            </div>

            <div className="relative flex gap-1.5 items-center">
              <label htmlFor="" className="text-[0.9rem]   font-medium">
                Đến:
              </label>
              <input
                required
                name="end"
                type="date"
                className="bg-gray-50 border border-gray-300 text-[0.9rem] p-[6px_10px] outline-none focus:border-gray-400  "
              />
            </div>

            <button className="p-[6px_10px] text-[0.9rem] bg-blue-500 text-white">
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]  ">Mã đơn</th>
              <th className="p-[1rem]  ">Tài khoản</th>

              <th className="p-[1rem]  ">Người đặt</th>
              <th className="p-[1rem]  ">Thanh toán</th>
              <th className="p-[1rem]  ">Tổng tiền</th>
              <th className="p-[1rem]  ">Ngày tạo</th>
              <th className="p-[1rem]   relative">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={array}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]  ">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] font-semibold">{order.orderCode}</td>
                  <td className="p-[1rem]  ">{order.email}</td>
                  <td className="p-[1rem]  ">{order.fullname}</td>

                  <td className="p-[1rem] uppercase">{order.paymethod}</td>
                  <td className="p-[1rem]  ">
                    {order.total.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="p-[1rem]">
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="p-[1rem]">
                    <select
                      name="status"
                      disabled={isLoadingUpdate}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, parseInt(e.target.value))
                      }
                      value={order.status}
                      className="border border-gray-300 p-[6px_10px] text-[0.9rem] outline-none focus:border-gray-400  "
                    >
                      {order.status === -1 && (
                        <option value="-1">Chờ thanh toán</option>
                      )}
                      {order.status === 0 && (
                        <>
                          <option value="0">Chờ xác nhận</option>
                          <option value="1">Xác nhận</option>
                          <option value="4">Hủy</option>
                        </>
                      )}
                      {order.status === 1 && (
                        <>
                          <option value="1">Xác nhận</option>
                          <option value="2">Đang giao</option>
                          <option value="4">Hủy</option>
                        </>
                      )}
                      {order.status === 2 && (
                        <>
                          <option value="2">Đang giao</option>
                          <option value="3">Giao thành công</option>
                          <option value="4">Hủy</option>
                        </>
                      )}
                      {order.status === 3 && (
                        <>
                          <option value="3">Giao thành công</option>
                          <option value="5">Trả hàng</option>
                        </>
                      )}
                      {order.status === 4 && <option value="4">Hủy</option>}
                      {order.status === 5 && (
                        <option value="5">Trả hàng</option>
                      )}
                    </select>
                  </td>
                  <td className="p-[1rem]  ">
                    <div className="flex items-center gap-[15px]">
                      <Link to={`/admin/order/${order.id}`}>
                        <LiaExternalLinkAltSolid
                          size={23}
                          className="text-[#076ffe]"
                        />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="w-full h-[70vh]">
                  <div className="flex justify-center items-center">
                    <Image
                      source={"/assets/notfound1.png"}
                      alt={""}
                      className={"w-[135px]"}
                      loading="lazy"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ListBody>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
      />
    </>
  );
}

export default OrderList;
