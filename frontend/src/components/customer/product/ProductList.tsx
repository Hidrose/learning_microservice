import { useLocation, useNavigate } from "react-router-dom";
import type { ProductListItemResponse } from "../../../types/type";
import Image from "../../ui/Image";
import ProductCard from "./ProductCard";
import { memo } from "react";
import ProductListSkeleton from "../skeleton/ProductListSkeleton";

interface Props {
  title?: string;
  products: ProductListItemResponse[];
  isLoading: boolean;
  total: number;
}

function ProductList({ title, products, isLoading = false, total }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("q");
  const pathname = location.pathname;

  const sortArray = [
    {
      name: "Mới nhất",
      sort: "newest",
    },
    {
      name: "Giá (thấp-cao)",
      sort: "price-asc",
    },
    {
      name: "Giá (cao-thấp)",
      sort: "price-desc",
    },
    {
      name: "Bán chạy nhất",
      sort: "bestseller",
    },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="mb-[40px] space-y-[15px]">
        <div className="flex justify-between items-center flex-wrap gap-[15px]">
          <h2 className="text-black">
            {isLoading && "Đang tải sản phẩm..."}
            {!isLoading && search && `Kết quả cho "${search}"`}
            {!isLoading && !search && `${title ?? "Không tìm thấy"} (${total})`}
          </h2>

          <select
            onChange={handleSortChange}
            value={searchParams.get("sort") ?? ""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-[0.9rem] rounded-sm block p-2 outline-0"
          >
            {sortArray.map((item, index) => (
              <option value={item.sort} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <ProductListSkeleton count={12} />
        ) : products.length > 0 ? (
          <div
            className={`grid grid-cols-2 gap-x-[10px] gap-y-[35px] lg:grid-cols-3 2xl:grid-cols-4 ${
              products.length <= 0 ? "h-[50vh]" : ""
            }`}
          >
            {products.map((product) => {
              return <ProductCard product={product} key={product.id} />;
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col justify-center items-center gap-[15px]">
              <Image
                source={"/assets/notfound1.png"}
                className={"w-[140px]"}
                alt={"not found"}
                loading="eager"
              />

              <h4>Không tìm thấy sản phẩm nào</h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default memo(ProductList);
