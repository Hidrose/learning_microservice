import { Link, useLocation } from "react-router-dom";
import useGetAccount from "../../hooks/auth/useGetAccount";
import useGetUser from "../../hooks/useGetUser";

function SideBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { account } = useGetAccount("customer");
  const { user } = useGetUser(account?.id || "");
  return (
    <div className="w-full max-w-full lg:max-w-[300px] self-start lg:sticky lg:top-[5rem] bg-white ">
      <div className="text-[0.9rem] font-medium">
        <div className="px-3.5 py-3 flex gap-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-user-star-icon lucide-user-star w-4 h-4"
            viewBox="2 2 21.06 20.67"
          >
            <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"></path>
            <path d="M8 15H7a4 4 0 0 0-4 4v2"></path>
            <circle cx="10" cy="7" r="4"></circle>
          </svg>

          <div>
            <h5 className="font-medium">Tài khoản của</h5>
            <p className="font-normal">{user?.fullname}</p>
          </div>
        </div>
        <Link
          to="/account/profile"
          className={` py-3 px-3.5 ${
            pathname === "/account/profile"
              ? "bg-gray-100 border-l-4 border-primary"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user-round-icon lucide-user-round w-4 h-4"
              viewBox="3 2 18 20"
            >
              <circle cx="12" cy="8" r="5"></circle>
              <path d="M20 21a8 8 0 0 0-16 0"></path>
            </svg>
            <span>Thông tin tài khoản</span>
          </div>
        </Link>

        <Link
          to="/order/history"
          className={` py-3 px-3.5  ${
            pathname === "/order/history" ||
            pathname.startsWith("/order/history")
              ? "bg-gray-100 border-l-4 border-primary"
              : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shopping-bag-icon lucide-shopping-bag w-4 h-4"
              viewBox="2 1 20 22"
            >
              <path d="M16 10a4 4 0 0 1-8 0"></path>
              <path d="M3.103 6.034h17.794"></path>
              <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
            </svg>
            <span>Đơn hàng</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
