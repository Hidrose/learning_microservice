import { Link } from "react-router-dom";
import Image from "../../../Image";
import SearchDesktop from "./SearchDesktop";
import ProfileMenu from "./ProfileMenu";
import { AiOutlineMenu } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { PiShoppingCart } from "react-icons/pi";
import { useCallback, useEffect, useState } from "react";
import SearchMobile from "./SearchMobile";
import Overplay from "../../../Overplay";
import MenuMobile from "./MenuMobile";
import AuthModal from "../auth/AuthModal";
import useGetCart from "../../../../hooks/customer/cart/useGetCart";

function Header() {
  const [authType, setAuthType] = useState<"login" | "register" | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const { cart } = useGetCart();

  const toggleProfileMenu = useCallback(() => {
    setProfileMenuOpen((prev) => !prev);
    setMenuMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setMenuMobileOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMenuMobileOpen((prev) => !prev);
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuMobileOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <header className="w-full bg-white sticky top-0 border-b border-gray-200 z-15">
        <div className="py-4 px-4 relative">
          <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
            <Link to={"/"}>
              <Image
                source={"/assets/logo.png"}
                alt={"logo"}
                className={"w-[100px]"}
                loading="eager"
              />
            </Link>

            <div className="hidden lg:flex w-[50%]">
              <SearchDesktop />
            </div>

            <div className="hidden lg:flex items-center gap-[15px] font-medium">
              <div
                className="relative cursor-pointer transition-colors group"
                onMouseEnter={toggleProfileMenu}
                onMouseLeave={toggleProfileMenu}
              >
                <div
                  className={`flex items-center gap-1 hover:text-white hover:bg-blue-500 px-2 py-1.5 rounded-md group-hover:bg-blue-500 group-hover:text-white`}
                >
                  <AiOutlineUser size={24} />
                  <span>Tài khoản</span>
                </div>

                <ProfileMenu
                  profileMenuOpen={profileMenuOpen}
                  onLogin={() => setAuthType("login")}
                  onRegister={() => setAuthType("register")}
                />
              </div>

              <Link to={"/cart"} className="relative">
                <div className="flex items-center gap-1 hover:text-white hover:bg-blue-500 px-2 py-1.5 rounded-md">
                  <div className="relative">
                    <PiShoppingCart size={24} />

                    <small className="absolute flex items-center justify-center top-[-12px] right-[-11px] bg-[#FF4C58] text-white text-[0.7rem] font-medium leading-none  rounded-full w-[20px] h-[20px]">
                      {cart?.items.length || 0}
                    </small>
                  </div>

                  <span>Giỏ hàng</span>
                </div>
              </Link>
            </div>

            {/* Mobile */}
            <div className="flex lg:hidden items-center gap-4 relative">
              <button onClick={toggleSearch}>
                <IoSearchOutline size={24} />
              </button>

              <div
                className="relative cursor-pointer group"
                onMouseEnter={toggleProfileMenu}
                onMouseLeave={toggleProfileMenu}
              >
                <AiOutlineUser size={24} />
                <ProfileMenu
                  profileMenuOpen={profileMenuOpen}
                  onLogin={() => setAuthType("login")}
                  onRegister={() => setAuthType("register")}
                />
              </div>

              <Link to={"/cart"} className="relative">
                <PiShoppingCart size={24} />

                <small className="absolute flex items-center justify-center top-[-9px] right-[-11px] bg-[#FF4C58] text-white text-[0.7rem] font-medium leading-none  rounded-full w-[20px] h-[20px]">
                  {cart?.items.length || 0}
                </small>
              </Link>

              <button onClick={toggleMobileMenu}>
                <AiOutlineMenu size={24} />
              </button>
            </div>
          </div>

          <SearchMobile onToggleSearch={toggleSearch} searchOpen={searchOpen} />

          <MenuMobile isOpen={menuMobileOpen} onToggleMenu={toggleMobileMenu} />
        </div>
      </header>

      {authType && (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
          onSwitch={(type) => setAuthType(type)}
        />
      )}

      {searchOpen && <Overplay onClose={toggleSearch} IndexForZ={12} />}
    </>
  );
}

export default Header;
