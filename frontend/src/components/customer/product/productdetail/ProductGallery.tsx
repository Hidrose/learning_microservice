import { GrNext, GrPrevious } from "react-icons/gr";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "../../../Image";
import { memo, useEffect, useState } from "react";
import type { ImageProductResponse } from "../../../../types/type";
import ImageViewer from "../../../ImageViewer";

type Props = {
  images: ImageProductResponse[];
};

function ProductGallery({ images }: Props) {
  const [mainImage, setMainImage] = useState<string>("");
  const [viewerImage, setViewerImage] = useState<string>("");
  const [openViewer, setOpenViewer] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    if (images?.length > 0) {
      setMainImage(images[0].image);
      setCurrentImageIndex(0);
    }
  }, [images]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => {
      const newIndex = (prev + 1) % images.length;
      setMainImage(images[newIndex].image);
      return newIndex;
    });
  };

  const handlePrevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => {
      const newIndex = (prev - 1 + images.length) % images.length;
      setMainImage(images[newIndex].image);
      return newIndex;
    });
  };

  const handleOpenViewer = (image: string) => {
    setViewerImage(image);
    setOpenViewer(true);
  };

  return (
    <>
      <div className="lg:max-w-[70px] w-full">
        <Swiper
          slidesPerView="auto"
          spaceBetween={10}
          className="lg:max-h-[500px] w-full"
          direction={isLargeScreen ? "vertical" : "horizontal"}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="!w-[70px] !h-[90px] cursor-pointer flex-shrink-0"
              onMouseEnter={() => {
                setMainImage(image.image);
                setCurrentImageIndex(index);
              }}
            >
              <div
                className={`border flex items-center justify-center w-full h-full ${
                  currentImageIndex === index
                    ? "border-gray-600"
                    : "border-gray-300"
                }`}
              >
                <Image
                  source={`${image.image}`}
                  alt=""
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        className="group flex justify-center w-full relative cursor-pointer "
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleOpenViewer(`${mainImage}`);
        }}
      >
        {mainImage && (
          <div className="group">
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute border right-1.5 top-1/2 w-10 h-10 bg-white rounded-full flex justify-center items-center -translate-y-1/2 z-10 p-2 lg:opacity-0 lg:group-hover:opacity-100 transition duration-300 hover:bg-[#FF4C58] hover:text-white"
            >
              <GrNext size={20} />
            </button>

            <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
              <Image
                source={`${mainImage}`}
                alt=""
                className="w-full h-full object-contain "
                loading="eager"
              />
            </div>

            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-1.5 top-1/2 w-10 h-10 border bg-white rounded-full flex justify-center items-center -translate-y-1/2 z-10 p-2 lg:opacity-0 lg:group-hover:opacity-100 transition duration-300 hover:bg-[#FF4C58] hover:text-white"
            >
              <GrPrevious size={20} />
            </button>
          </div>
        )}
      </div>

      {openViewer && (
        <ImageViewer
          image={viewerImage}
          open={openViewer}
          onClose={() => setOpenViewer(false)}
        />
      )}
    </>
  );
}

export default memo(ProductGallery);
