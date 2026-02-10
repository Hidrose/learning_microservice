import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Loading from "../../../Loading";
import ProductDetail from "./ProductDetail";
import ProductSlider from "../ProductSlider";
import BreadCrumb from "../../BreadCrumb";
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

  if (isLoading || isLoadingProducts) {
    return <Loading height={70} size={50} color="black" thickness={2} />;
  }

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
      {product && <ProductDetail product={product} />}
      {products && (
        <ProductSlider products={products} title="Bạn có thể thích" />
      )}
    </>
  );
}

export default ProductDetailContainer;
