import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import ProductDetail from "./ProductDetail";
import ProductSlider from "../ProductSlider";
import BreadCrumb from "../../ui/BreadCrumb";
import useGetProduct from "../../../../hooks/customer/product/useGetProduct";
import useGetSuggestionProducts from "../../../../hooks/customer/product/list/useActiveProducts";

function ProductDetailContainer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { product, isLoading } = useGetProduct(slug || "");
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
      <ProductDetail product={product!} />

      <ProductSlider
        products={products}
        title="Bạn có thể thích"
        isLoading={isLoadingProducts}
      />
    </>
  );
}

export default ProductDetailContainer;
