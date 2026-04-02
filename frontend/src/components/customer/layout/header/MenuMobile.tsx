import { memo, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import Overplay from "../../ui/Overplay";
import useGetActiveCategories from "../../../../hooks/customer/category/useGetActiveCategories";

type MenuMobileProps = {
  isOpen: boolean;
  onToggleMenu: () => void;
};
function MenuMobile({ isOpen, onToggleMenu }: MenuMobileProps) {
  const { categories } = useGetActiveCategories();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleOpen = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`custom-scroll text-[0.9rem] fixed top-0 w-full max-w-[320px] h-screen py-[20px] px-[15px] overflow-y-auto bg-white shadow-md transition-all duration-500 ease-in-out z-16 ${
          isOpen ? "right-0 visible" : "right-[-100%] invisible"
        }`}
      >
        <div className="flex justify-end items-center">
          <button onClick={onToggleMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x w-4"
              viewBox="5 5 14 14"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <ul className="py-[20px] ">
          <li
            className="border-b border-gray-300 cursor-pointer"
            onClick={() => toggleOpen(`a3`)}
          >
            <div className="w-full flex justify-between items-center py-[15px] text-black font-semibold">
              <p>Danh mục</p>
              <button>
                {openMenus[`a3`] ? <FaMinus size={15} /> : <FaPlus size={15} />}
              </button>
            </div>

            <ul
              className={`max-h-0 overflow-hidden invisible transition-all duration-600 ease-in-out ${
                openMenus[`a3`] ? "max-h-fit visible" : ""
              }`}
            >
              <li>
                <Link
                  to={`/products/all`}
                  className="py-[15px]  font-medium hover:text-black"
                >
                  Tất cả
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/${category.slug}`}
                    className="py-[15px]  font-medium hover:text-black"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="border-b border-gray-300 cursor-pointer text-black font-semibold">
            <Link to={"/products/sale"} className="py-[15px]">
              Giảm giá
            </Link>
          </li>
        </ul>
      </nav>

      {isOpen && <Overplay onClose={onToggleMenu} IndexForZ={15} />}
    </>
  );
}

export default memo(MenuMobile);
