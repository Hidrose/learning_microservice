import { memo } from "react";
import { Link } from "react-router-dom";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import useLogout from "../../../../hooks/auth/useLogout";
import { openAuthModal } from "../../../../redux/slices/AuthModalSlice";
import { useDispatch } from "react-redux";
type Props = {
  profileMenuOpen: boolean;
};

function ProfileMenu({ profileMenuOpen }: Props) {
  const { account, isLoading } = useGetAccount("customer");
  const { handleLogout } = useLogout();
  const dispatch = useDispatch();

  if (!profileMenuOpen) return null;

  return (
    <div
      className={`text-[0.9rem] font-medium absolute top-full right-0 z-20 bg-white shadow-md rounded-sm overflow-hidden w-max transition-all duration-100 origin-top`}
    >
      {isLoading ? null : account ? (
        <>
          <p className="border-b p-2.5 border-gray-200 max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
            Xin chào, {account.fullname}
          </p>

          <Link
            className="hover:bg-gray-100 w-full block p-2.5"
            to="/account/profile"
          >
            Thông tin tài khoản
          </Link>

          <Link
            className="hover:bg-gray-100 w-full block p-2.5"
            to="/order/history"
          >
            Đơn hàng
          </Link>

          <button
            onClick={async () => {
              await handleLogout("customer");
            }}
            className="hover:bg-gray-100 w-full block p-2.5 text-left"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => dispatch(openAuthModal("login"))}
            className="hover:bg-gray-100 w-full block p-2.5 text-left"
          >
            Đăng nhập
          </button>

          <button
            onClick={() => dispatch(openAuthModal("register"))}
            className="hover:bg-gray-100 w-full block p-2.5 text-left"
          >
            Đăng ký
          </button>
        </>
      )}
    </div>
  );
}

export default memo(ProfileMenu);
