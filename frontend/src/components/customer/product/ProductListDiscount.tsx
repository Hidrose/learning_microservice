import BreadCrumb from "../ui/BreadCrumb";
import Pagination from "../ui/Pagination";
import ProductList from "./ProductList";
import useGetActiveDiscountProducts from "../../../hooks/customer/product/page/useGetActiveDiscountProduct";

function ProductListDiscount() {
  const { products, totalItems, totalPages, currentPage, isLoading } =
    useGetActiveDiscountProducts();
  const array = [
    {
      name: "Trang chủ",
      href: "/",
    },
    {
      name: "Giảm giá",
    },
  ];
  return (
    <>
      <BreadCrumb items={array} />
      <section className="mb-[40px] px-[15px]">
        <div className="mx-auto max-w-[1200px] w-full">
          <ProductList
            products={products}
            title="Giảm giá"
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

export default ProductListDiscount;
