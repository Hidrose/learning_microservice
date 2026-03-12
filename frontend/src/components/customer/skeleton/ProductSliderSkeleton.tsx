import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
type Props = {
  count: number;
};

function ProductSliderSkeleton({ count }: Props) {
  return (
    <Swiper
      spaceBetween={12}
      modules={[FreeMode]}
      freeMode={true}
      breakpoints={{
        0: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1640: { slidesPerView: 4 },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SwiperSlide key={index} className="animate-pulse">
          <div className="w-full pt-[100%] bg-gray-200 relative mb-[12px]" />
          <div className="h-[14px] bg-gray-200 rounded mb-[8px]" />
          <div className="h-[12px] bg-gray-200 rounded w-2/3 mb-[10px]" />
          <div className="h-[14px] bg-gray-300 rounded w-1/2" />{" "}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default memo(ProductSliderSkeleton);
