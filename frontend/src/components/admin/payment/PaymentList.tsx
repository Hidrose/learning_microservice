import Image from "../../Image";
import Loading from "../../Loading";
import InputSearch from "../InputSearch";
import Pagination from "../Pagination";
import FilterDropDownMenu from "../FilterDropDownMenu";
import ListHeader from "../list/ListHeader";
import ListBody from "../list/ListBody";
import useGetPayments from "../../../hooks/admin/payment/useGetPayments";

function PaymentList() {
  const { payments, isLoading, totalItems, totalPages, currentPage, limit } =
    useGetPayments();

  const array = [
    { name: "Tất cả", value: null },
    { name: "Thành công", value: 1 },
    { name: "Hoàn tiền", value: 0 },
  ];

  return (
    <>
      <ListHeader title="Thanh toán" totalItems={totalItems} />

      <ListBody>
        <div className="p-[1.2rem]">
          <InputSearch />
        </div>

        <table className="w-[350%] border-collapse sm:w-[220%] xl:w-full text-[0.9rem]">
          <thead>
            <tr className="bg-[#E9EDF2] text-left">
              <th className="p-[1rem]">Mã đơn</th>
              <th className="p-[1rem]">Mã giao dịch</th>
              <th className="p-[1rem]">Cổng thanh toán</th>
              <th className="p-[1rem]">Số tiền</th>
              <th className="p-[1rem] relative">
                <FilterDropDownMenu
                  title="Tình trạng"
                  array={array}
                  paramName="status"
                />
              </th>
              <th className="p-[1rem]">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="w-full">
                  <Loading height={60} size={50} color="black" thickness={2} />
                </td>
              </tr>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#f2f3f8]">
                  <td className="p-[1rem] font-semibold">
                    {payment.orderCode}
                  </td>
                  <td className="p-[1rem]">{payment.transactionId}</td>
                  <td className="p-[1rem] uppercase">{payment.paymethod}</td>

                  <td className="p-[1rem]">
                    {payment.amount.toLocaleString("vi-VN")}₫
                  </td>

                  <td className="p-[1rem]">
                    {payment.status === 1
                      ? "Thành công"
                      : payment.status === 0
                        ? "Hoàn tiền"
                        : ""}
                  </td>
                  <td className="p-[1rem]">
                    {new Date(payment.createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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

export default PaymentList;
