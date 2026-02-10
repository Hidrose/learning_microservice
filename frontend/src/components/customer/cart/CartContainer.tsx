import useGetCart from "../../../hooks/customer/cart/useGetCart";
import useGetSuggestionProducts from "../../../hooks/customer/product/list/useActiveProducts";
import Loading from "../../Loading";
import ProductSlider from "../product/ProductSlider";
import CartItemList from "./CartItemList";

function CartContainer() {
  const { cart, isLoading: isLoadingCart, mutate } = useGetCart();
  const { products, isLoading: isLoadingProducts } =
    useGetSuggestionProducts(12);

  if (isLoadingCart || isLoadingProducts) {
    return <Loading height={60} size={50} color="black" thickness={2} />;
  }

  return (
    <>
      <CartItemList cart={cart!} mutate={mutate} />
      {products && (
        <ProductSlider products={products} title="Bạn có thể thích" />
      )}
    </>
  );
}

export default CartContainer;
