import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "../../Image";
function MainBanner() {
  const banners = [
    {
      mobile: "/assets/banners/mainbanner1.png",
      desktop: "/assets/banners/mainbanner1.png",
    },
    {
      mobile: "/assets/banners/mainbanner2.png",
      desktop: "/assets/banners/mainbanner2.png",
    },
    {
      mobile: "/assets/banners/mainbanner3.png",
      desktop: "/assets/banners/mainbanner3.png",
    },
  ];
  return (
    <section className="mb-[40px]">
      <div className="w-full max-w-[1200px] mx-auto">
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true, type: "bullets" }}
          autoplay={{ delay: 5000 }}
          loop={true}
          speed={1000}
          grabCursor={true}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="relative block w-full h-full">
                <div className="w-full">
                  <picture>
                    <source srcSet={banner.mobile} media="(max-width: 768px)" />
                    <Image
                      source={banner.desktop}
                      alt={"banner"}
                      className={"w-full object-center"}
                      loading="eager"
                    />
                  </picture>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default MainBanner;
