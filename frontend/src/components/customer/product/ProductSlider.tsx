import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import ProductCard from "./ProductCard";
import type { ProductResponse } from "../../../types/type";
import { memo } from "react";
import ProductSliderSkeleton from "../skeleton/ProductSliderSkeleton";

interface Props {
  title: string;
  isLoading?: boolean;
  products: ProductResponse[];
}

function ProductSlider({ title, isLoading = false, products }: Props) {
  return (
    <>
      <section className="mb-[40px] px-[15px] text-black">
        <div className="mx-auto max-w-[1200px] w-full">
          <h2 className="mb-[20px]">{title}</h2>
          {isLoading ? (
            <ProductSliderSkeleton count={4} />
          ) : (
            products.length > 0 && (
              <Swiper
                spaceBetween={10}
                modules={[FreeMode]}
                freeMode={true}
                grabCursor={true}
                breakpoints={{
                  0: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1640: {
                    slidesPerView: 4,
                  },
                }}
              >
                {products.map((product) => {
                  return (
                    <SwiperSlide key={product.id}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )
          )}
        </div>
      </section>
    </>
  );
}

export default memo(ProductSlider);
