import useGetAccount from "../../hooks/auth/useGetAccount";

function Account() {
  const { account } = useGetAccount("admin");
  return (
    <div className="py-[30px] sm:px-[25px] px-[15px] bg-[#F1F4F9] h-full">
      <form className="flex flex-col gap-7 w-full">
        <h2 className="text-[#74767d]">Tài khoản</h2>

        <div className="gap-[25px] w-full flex flex-wrap lg:flex-nowrap">
          <div className="sm:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[20px] w-full">
            <h5 className="font-bold text-[#74767d]">Thông tin tài khoản</h5>

            <div className="flex flex-col gap-1 w-full ">
              <label htmlFor="" className="text-[0.9rem]  font-medium">
                Họ tên
              </label>
              <input
                type="text"
                name="fullname"
                value={account?.fullname}
                readOnly
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full ">
              <label htmlFor="" className="text-[0.9rem]  font-medium">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={account?.email}
                readOnly
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full ">
              <label htmlFor="" className="text-[0.9rem]  font-medium">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={account?.phone}
                readOnly
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>

            <div className="flex flex-col gap-1 w-full ">
              <label htmlFor="" className="text-[0.9rem]  font-medium">
                Chức vụ
              </label>
              <input
                type="text"
                name="role"
                value={account?.role === "admin" ? "Quản trị viên" : ""}
                readOnly
                className="border border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none focus:border-gray-400  "
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Account;
