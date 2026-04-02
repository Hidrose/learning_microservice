import MainBanner from "./MainBanner";
import ProductSlider from "../product/ProductSlider";
import PromotionBanner from "./PromotionBanner";
import useGetActiveProducts from "../../../hooks/customer/product/list/useActiveProducts";
import useGetBestsellerProducts from "../../../hooks/customer/product/list/useGetBestSellerProducts";

function Home() {
  const { products: products1, isLoading: isLoading1 } =
    useGetActiveProducts(12);
  const { products: products2, isLoading: isLoading2 } =
    useGetBestsellerProducts(12);

  return (
    <>
      <MainBanner />
      <ProductSlider
        products={products1}
        isLoading={isLoading1}
        title="Mới nhất"
      />
      <PromotionBanner
        banners={[
          {
            desktop: "/assets/banners/banner1.png",
            mobile: "/assets/banners/banner1.png",
          },
          {
            desktop: "/assets/banners/banner2.png",
            mobile: "/assets/banners/banner2.png",
          },
        ]}
      />
      <ProductSlider
        products={products2}
        isLoading={isLoading2}
        title="Bán chạy nhất"
      />
      <PromotionBanner
        banners={[
          {
            desktop: "/assets/banners/banner1.png",
            mobile: "/assets/banners/banner1.png",
          },
          {
            desktop: "/assets/banners/banner2.png",
            mobile: "/assets/banners/banner2.png",
          },
        ]}
      />
    </>
  );
}

export default Home;
