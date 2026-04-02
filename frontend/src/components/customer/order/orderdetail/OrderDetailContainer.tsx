import BreadCrumb from "../../ui/BreadCrumb";
import OrderInfo from "./OrderInfo";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import SideBar from "../../ui/SideBar";
import useGetOrder from "../../../../hooks/customer/order/useGetOrder";
function OrderDetailContainer() {
  const navigate = useNavigate();
  const { code } = useParams();

  const { order, isLoading } = useGetOrder(code || "");

  const array = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: "Đơn hàng",
      href: "/order/history",
    },
    {
      name: `Mã đơn ${code}`,
    },
  ];

  useEffect(() => {
    if (isLoading) return;

    if (!order) {
      toast.error("Đơn hàng không tìm thấy");
      navigate("/order");
    }
  }, [isLoading, order, navigate]);

  return (
    <>
      <BreadCrumb items={array} />

      <section className="mb-[40px]">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex justify-center flex-wrap gap-5">
            <SideBar />

            <OrderInfo order={order!} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderDetailContainer;
