import { Link } from "react-router-dom";
import Image from "../../ui/Image";

type Props = {
  banners: {
    mobile: string;
    desktop: string;
  }[];
};

function PromotionBanner({ banners }: Props) {
  return (
    <section className="mb-[40px]">
      <div className="mx-auto max-w-[1200px] w-full">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-[15px]">
          {banners.map((banner, index) => (
            <Link to="/products/all" key={index}>
              <div className="relative w-full">
                <picture>
                  <source srcSet={banner.mobile} media="(max-width: 768px)" />
                  <Image
                    source={banner.desktop}
                    alt="banner"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PromotionBanner;
