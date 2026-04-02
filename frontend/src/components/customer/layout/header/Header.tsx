import { Link } from "react-router-dom";
import Image from "../../../ui/Image";
import SearchDesktop from "./SearchDesktop";
import ProfileMenu from "./ProfileMenu";
import { AiOutlineMenu } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { PiShoppingCart } from "react-icons/pi";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchMobile from "./SearchMobile";
import Overplay from "../../ui/Overplay";
import MenuMobile from "./MenuMobile";
import AuthModal from "../auth/AuthModal";
import useGetCart from "../../../../hooks/customer/cart/useGetCart";
import { TbCategoryPlus } from "react-icons/tb";
import MenuDropDown from "./CategoryDropDown";
import useGetActiveCategories from "../../../../hooks/customer/category/useGetActiveCategories";

function Header() {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [categoryDropDownOpen, setCategoryDropDownOpen] =
    useState<boolean>(false);

  const { cart } = useGetCart();
  const { categories } = useGetActiveCategories();

  const totalQuantity = useMemo(() => {
    return (
      cart?.items.reduce((sum, item) => {
        return sum + (item?.quantity || 0);
      }, 0) || 0
    );
  }, [cart?.items]);

  const toggleCategoryDropDown = useCallback(() => {
    setCategoryDropDownOpen((prev) => !prev);
    setMenuMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setProfileMenuOpen((prev) => !prev);
    setMenuMobileOpen(false);
    setSearchOpen(false);
    setCategoryDropDownOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setMenuMobileOpen(false);
    setCategoryDropDownOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMenuMobileOpen((prev) => !prev);
    setSearchOpen(false);
    setCategoryDropDownOpen(false);
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

            {/* Desktop */}
            <div
              className="hidden lg:block relative cursor-pointer transition-colors group"
              onMouseEnter={toggleCategoryDropDown}
              onMouseLeave={toggleCategoryDropDown}
            >
              <div
                className={`flex items-center gap-1 hover:text-white hover:bg-primary px-2 py-1.5 rounded-md group-hover:bg-primary group-hover:text-white`}
              >
                <TbCategoryPlus size={24} />
                <span className="font-medium">Danh mục</span>
              </div>

              <MenuDropDown
                categories={categories}
                categoryDropDownOpen={categoryDropDownOpen}
              />
            </div>

            <div className="hidden lg:flex w-[50%]">
              <SearchDesktop />
            </div>

            <div className="hidden lg:flex items-center gap-[15px]">
              <div
                className="relative cursor-pointer transition-colors group"
                onMouseEnter={toggleProfileMenu}
                onMouseLeave={toggleProfileMenu}
              >
                <div
                  className={`flex items-center gap-1 hover:text-white hover:bg-primary px-2 py-1.5 rounded-md group-hover:bg-primary group-hover:text-white`}
                >
                  <AiOutlineUser size={24} />
                  <span className="font-medium">Tài khoản</span>
                </div>

                <ProfileMenu profileMenuOpen={profileMenuOpen} />
              </div>

              <Link to={"/cart"} className="relative">
                <div className="flex items-center gap-1 hover:text-white hover:bg-primary px-2 py-1.5 rounded-md">
                  <div className="relative">
                    <PiShoppingCart size={24} />

                    <small className="absolute flex items-center justify-center top-[-12px] right-[-11px] bg-accent text-white text-[0.7rem] font-medium leading-none  rounded-full w-[20px] h-[20px]">
                      {totalQuantity}
                    </small>
                  </div>

                  <span className="font-medium">Giỏ hàng</span>
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
                <ProfileMenu profileMenuOpen={profileMenuOpen} />
              </div>

              <Link to={"/cart"} className="relative">
                <PiShoppingCart size={24} />

                <small className="absolute flex items-center justify-center top-[-9px] right-[-11px] bg-accent text-white text-[0.7rem] font-medium leading-none  rounded-full w-[20px] h-[20px]">
                  {totalQuantity}
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

      <AuthModal />

      {searchOpen && <Overplay onClose={toggleSearch} IndexForZ={14} />}
    </>
  );
}

export default Header;
