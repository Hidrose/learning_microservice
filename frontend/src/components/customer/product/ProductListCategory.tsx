import { useParams } from "react-router-dom";
import BreadCrumb from "../ui/BreadCrumb";
import Pagination from "../ui/Pagination";
import ProductList from "./ProductList";
import useGetActiveProductsByCategory from "../../../hooks/customer/product/page/useGetActiveProductsByCategory";

function ProductListCategory() {
  const { slug } = useParams();
  const { products, totalItems, totalPages, currentPage, isLoading } =
    useGetActiveProductsByCategory(slug || "");
  const array = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: slug === "all" ? "Tất cả sản phẩm" : products[0]?.categoryName,
    },
  ];
  return (
    <>
      <BreadCrumb items={array} />
      <section className="mb-[40px] px-[15px]">
        <div className="mx-auto max-w-[1200px] w-full">
          <ProductList
            products={products}
            title={
              slug === "all" ? "Tất cả sản phẩm" : products[0]?.categoryName
            }
            isLoading={isLoading}
            total={totalItems}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            totalItems={totalItems}
          />
        </div>
      </section>
    </>
  );
}

export default ProductListCategory;
