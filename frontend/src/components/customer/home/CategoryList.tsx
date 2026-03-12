import Image from "../../ui/Image";
import { Link } from "react-router-dom";
import useGetActiveCategories from "../../../hooks/customer/category/useGetActiveCategories";
import CategoryListSkeleton from "../skeleton/CategoryListSkeleton";

function CategoryList() {
  const { categories, isLoading } = useGetActiveCategories();

  return (
    <>
      {isLoading ? (
        <CategoryListSkeleton count={12} />
      ) : (
        <aside className="w-auto sticky top-[80px] max-h-fit overflow-y-auto custom-scroll lg:block hidden lg:my-4 my-0 shadow-md">
          <div className="p-[12px_8px] text-black">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/${category.slug}`}
                    className="p-[7px_16px] hover:bg-gray-100 transition rounded-md"
                  >
                    <div className="flex items-center gap-3">
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
                  className="p-[7px_16px] hover:bg-gray-100 transition rounded-md"
                >
                  <div className="flex items-center gap-3">
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
        </aside>
      )}
    </>
  );
}

export default CategoryList;
