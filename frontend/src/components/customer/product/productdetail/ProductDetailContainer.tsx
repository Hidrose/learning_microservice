import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import ProductDetail from "./ProductDetail";
import ProductSlider from "../ProductSlider";
import BreadCrumb from "../../ui/BreadCrumb";
import useGetSuggestionProducts from "../../../../hooks/customer/product/list/useActiveProducts";
import useGetActiveProduct from "../../../../hooks/customer/product/useGetActiveProduct";
import ProductDetailSkeleton from "../../skeleton/ProductDetailSkeleton";

function ProductDetailContainer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { product, isLoading } = useGetActiveProduct(slug || "");
  const { products, isLoading: isLoadingProducts } =
    useGetSuggestionProducts(12);

  useEffect(() => {
    if (isLoading) return;

    if (!product) {
      toast.error("Sản phẩm không tìm thấy");
      navigate("/", { replace: true });
    }
  }, [product, isLoading, navigate]);

  const array = [
    { name: "Trang chủ", href: "/" },
    {
      name: product?.category?.name ?? "",
      href: `/products/${product?.category?.slug ?? ""}`,
    },
    { name: product?.name ?? "" },
  ];

  return (
    <>
      <BreadCrumb items={array} />

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : product ? (
        <ProductDetail product={product} />
      ) : null}

      <ProductSlider
        products={products}
        title="Bạn có thể thích"
        isLoading={isLoadingProducts}
      />
    </>
  );
}

export default ProductDetailContainer;
