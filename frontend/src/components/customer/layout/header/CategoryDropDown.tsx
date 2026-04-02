import { Link } from "react-router-dom";
import type { CategoryResponse } from "../../../../types/type";
import Image from "../../../ui/Image";
import { memo } from "react";

type Props = {
  categories: CategoryResponse[];
  categoryDropDownOpen: boolean;
};

function CategoryDropDown({ categories, categoryDropDownOpen }: Props) {
  if (!categoryDropDownOpen) return null;
  return (
    <ul
      className={`text-[0.9rem] absolute top-full right-0 z-20 bg-white shadow-md rounded-sm overflow-hidden w-max transition-all duration-100 origin-top`}
    >
      <div className="block w-full text-black">
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/products/${category.slug}`}
                className="p-[10px_12px] hover:bg-gray-100 transition rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Image
                    source={category.image || ""}
                    alt={category.name}
                    className="w-[25px] h-[25px]"
                    loading="lazy"
                  />

                  <p className="font-medium">{category.name}</p>
                </div>
              </Link>
            </li>
          ))}

          <li>
            <Link
              to={`/products/sale`}
              className="p-[10px_12px] hover:bg-gray-100 transition rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  source={"/assets/discount1.png"}
                  alt={""}
                  className="w-[25px] h-[25px]"
                  loading="lazy"
                />

                <p className="font-medium">Giảm giá</p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </ul>
  );
}

export default memo(CategoryDropDown);
