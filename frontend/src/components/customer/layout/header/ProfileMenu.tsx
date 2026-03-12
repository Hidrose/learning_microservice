import { memo } from "react";
import { Link } from "react-router-dom";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import useLogout from "../../../../hooks/auth/useLogout";

type Props = {
  onLogin: () => void;
  onRegister: () => void;
  profileMenuOpen: boolean;
};

function ProfileMenu({ onLogin, onRegister, profileMenuOpen }: Props) {
  const { account, isLoading, mutate } = useGetAccount("customer");
  const { handleLogout } = useLogout();

  if (!profileMenuOpen) return null;

  return (
    <div className="text-[0.9rem] absolute top-full right-0 z-20 bg-white shadow-md rounded-sm overflow-hidden min-w-[125px] font-normal">
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
              mutate(undefined, false);
            }}
            className="hover:bg-gray-100 w-full block p-2.5 text-left"
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onLogin}
            className="hover:bg-gray-100 w-full block p-2.5 text-left"
          >
            Đăng nhập
          </button>

          <button
            onClick={onRegister}
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
