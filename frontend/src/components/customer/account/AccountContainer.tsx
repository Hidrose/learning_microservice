import BreadCrumb from "../BreadCrumb";
import SideBar from "../SideBar";
import AccountForm from "./AccountForm";
function Account() {
  const array = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: "Thông tin tài khoản",
    },
  ];
  return (
    <>
      <BreadCrumb items={array} />
      <section className="mb-[40px]">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex justify-center flex-wrap gap-5">
            <SideBar />

            <AccountForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default Account;
