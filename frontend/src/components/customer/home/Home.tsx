import MainBanner from "./MainBanner";
import CategoryList from "./CategoryList";
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
    <section className="w-full">
      <div className="max-w-[1200px] mx-auto flex gap-[15px]">
        <CategoryList />

        <main className="flex-1 min-w-0 rounded-md lg:my-4 my-0">
          <MainBanner />
          <ProductSlider
            products={products1}
            isLoading={isLoading1}
            title="Mới nhất"
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
        </main>
      </div>
    </section>
  );
}

export default Home;
