import useGetCart from "../../../hooks/customer/cart/useGetCart";
import useGetSuggestionProducts from "../../../hooks/customer/product/list/useActiveProducts";
import ProductSlider from "../product/ProductSlider";
import CartItemList from "./CartItemList";

function CartContainer() {
  const { cart, isLoading: isLoadingCart } = useGetCart();
  const { products, isLoading: isLoadingProducts } =
    useGetSuggestionProducts(12);

  return (
    <>
      <CartItemList cart={cart!} isLoading={isLoadingCart} />

      <ProductSlider
        products={products}
        title="Bạn có thể thích"
        isLoading={isLoadingProducts}
      />
    </>
  );
}

export default CartContainer;
