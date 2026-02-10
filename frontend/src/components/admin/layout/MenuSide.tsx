import { memo, useState, type ReactNode } from "react";
import Overplay from "../Overplay";
import Image from "../../Image";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiComputerLine, RiShoppingBag4Line } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineCreditCard } from "react-icons/ai";
import { TiTags } from "react-icons/ti";
type Props = {
  menuOpen: boolean;
  onToggleMenu: () => void;
};

type MenuChild = {
  label: string;
  path: string;
};

type MenuItemBase = {
  icon: ReactNode;
  label: string;
};

type MenuItemWithChildren = MenuItemBase & {
  key: string;
  children: MenuChild[];
  path?: never;
};

type MenuItemSingle = MenuItemBase & {
  path: string;
  children?: never;
  key?: never;
};

type MenuItem = MenuItemWithChildren | MenuItemSingle;

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

function MenuSide({ menuOpen, onToggleMenu }: Props) {
  const location = useLocation();
  const pathname = location.pathname;
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const menuData: MenuGroup[] = [
    {
      title: "Sản phẩm",
      items: [
        {
          icon: <RiComputerLine size={20} />,
          label: "Sản phẩm",
          key: "2a",
          children: [
            { label: "Danh sách sản phẩm", path: "/admin/products" },
            { label: "Thêm sản phẩm", path: "/admin/add-product" },
          ],
        },
        {
          icon: <TbCategoryPlus size={20} />,
          label: "Danh mục",
          key: "3a",
          children: [
            { label: "Danh sách danh mục", path: "/admin/categories" },
            { label: "Thêm danh mục", path: "/admin/add-category" },
          ],
        },
        {
          icon: <TiTags size={20} />,
          label: "Thương hiệu",
          key: "4a",
          children: [
            { label: "Danh sách thương hiệu", path: "/admin/brands" },
            { label: "Thêm thương hiệu", path: "/admin/add-brand" },
          ],
        },
      ],
    },
    {
      title: "Đơn hàng & thanh toán",
      items: [
        {
          icon: <RiShoppingBag4Line size={20} />,
          label: "Đơn hàng",
          path: "/admin/orders",
        },
        {
          icon: <AiOutlineCreditCard size={20} />,
          label: "Thanh toán",
          path: "/admin/payments",
        },
      ],
    },
    {
      title: "Người dùng",
      items: [
        {
          icon: <FaRegAddressCard size={20} />,
          label: "Quản trị viên",
          key: "5a",
          children: [
            { label: "Danh sách quản trị viên", path: "/admin/admins" },
            { label: "Thêm quản trị viên", path: "/admin/add-admin" },
          ],
        },
        {
          icon: <FaRegCircleUser size={20} />,
          label: "Khách hàng",
          path: "/admin/customers",
        },
      ],
    },
  ];

  const toggleOpen = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <nav
        className={` ${menuOpen ? "left-0" : "left-[-100%]"} 
        ${
          menuOpen ? "xl:translate-x-[-100%] xl:p-0 xl:w-0" : "xl:translate-x-0"
        } custom-scroll fixed border top-0 h-screen w-[320px] pb-5 bg-white transition-all duration-350 ease-in-out z-100 xl:sticky overflow-y-auto border-b border-gray-200`}
      >
        <div className="mb-[20px] flex justify-center sticky top-0 bg-white px-3.5 py-4.5">
          <Link to="/">
            <Image
              source={"/assets/logo.png"}
              alt=""
              className="w-[100px]"
              loading="eager"
            />
          </Link>
        </div>
        <ul className="flex flex-col gap-[15px] font-semibold px-3.5">
          {menuData.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-[10px]">
              <p className="  uppercase">{group.title}</p>
              {group.items.map((item, index) => (
                <li key={index}>
                  {item.children ? (
                    <>
                      <div
                        onClick={() => toggleOpen(item.key)}
                        className={`${
                          openMenus[item.key] ||
                          item.children.some((child) => pathname === child.path)
                            ? "text-blue-500"
                            : "hover:bg-gray-100"
                        } rounded-lg p-3 w-full cursor-pointer flex justify-between items-center`}
                      >
                        <p className="font-medium flex items-center gap-[10px]">
                          {item.icon} {item.label}
                        </p>
                        <button>
                          {openMenus[item.key] ||
                          item.children.some(
                            (child) => pathname === child.path,
                          ) ? (
                            <IoIosArrowDown size={18} />
                          ) : (
                            <IoIosArrowUp size={18} />
                          )}
                        </button>
                      </div>
                      <ul
                        className={`max-h-0 overflow-hidden invisible transition-all duration-600 ease-in-out pl-[25px] ${
                          openMenus[item.key] ||
                          item.children.some((child) => pathname === child.path)
                            ? "max-h-fit visible"
                            : ""
                        }`}
                      >
                        {item.children.map((child, childIndex) => (
                          <li
                            key={childIndex}
                            className={`rounded-lg w-full cursor-pointer my-[5px] ${
                              pathname === child.path
                                ? "text-white bg-blue-500"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Link
                              to={child.path}
                              className="text-[0.9rem] font-medium p-3"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`${
                        pathname === item.path
                          ? "text-white bg-blue-500"
                          : "hover:bg-gray-100"
                      } rounded-lg p-3 w-full cursor-pointer flex justify-between items-center`}
                    >
                      <p className="font-medium flex items-center gap-[10px]">
                        {item.icon} {item.label}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </div>
          ))}
        </ul>
      </nav>

      {menuOpen && <Overplay onClose={onToggleMenu} />}
    </>
  );
}

export default memo(MenuSide);
