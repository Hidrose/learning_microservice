import { memo } from "react";
import Image from "../../../ui/Image";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiLogoutBoxLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import useLogout from "../../../../hooks/auth/useLogout";

type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

function ProfileMenu({ menuOpen, onToggleMenu }: Props) {
  const { account, mutate } = useGetAccount("admin");
  const { handleLogout } = useLogout();

  return (
    <>
      {account && (
        <div
          className="text-[0.9rem] relative group"
          onMouseOver={onToggleMenu}
          onMouseOut={onToggleMenu}
        >
          <div className="flex cursor-pointer items-center gap-[6px]">
            <div className="w-[30px] rounded-full border border-gray-300 p-1">
              <Image
                source={"/assets/owner.png"}
                alt={""}
                className="w-full"
                loading="eager"
              />
            </div>
            <p>{account.fullname}</p>
          </div>

          {menuOpen && (
            <div className="absolute top-full right-0 w-[185px] z-20 bg-white shadow-md rounded-md border border-gray-200">
              <p className="border-b p-2.5 border-gray-300 max-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
                Xin chào, {account.fullname}
              </p>

              <Link
                to={"/admin/account/profile"}
                className="w-ful block hover:bg-gray-100 px-3 py-3.5"
              >
                <div className="flex items-center gap-[8px]">
                  <FaRegCircleUser size={18} />
                  <p>Tài khoản</p>
                </div>
              </Link>

              <button
                className="w-full block hover:bg-gray-100 px-3 py-3.5"
                onClick={() => {
                  handleLogout("admin");
                  mutate();
                }}
              >
                <div className="flex items-center gap-[8px] text-accent font-normal">
                  <RiLogoutBoxLine size={18} />
                  <p>Đăng xuất</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default memo(ProfileMenu);
