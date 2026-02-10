import OrderList from "./OrderList";
import SideBar from "../SideBar";
import BreadCrumb from "../BreadCrumb";

function OrderContainer() {
  const array = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: "Đơn hàng",
    },
  ];
  return (
    <>
      <BreadCrumb items={array} />

      <section className="mb-[40px]">
        <div className="w-full max-w-[1200px] mx-auto relative">
          <div className="flex justify-center flex-wrap gap-5">
            <SideBar />

            <OrderList />
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderContainer;
