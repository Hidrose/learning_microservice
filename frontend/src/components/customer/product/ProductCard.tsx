import { Link } from "react-router-dom";
import Image from "../../ui/Image";
import type { ProductResponse } from "../../../types/type";

interface Props {
  product: ProductResponse;
}
function ProductCard({ product }: Props) {
  return (
    <div className="space-y-[15px]">
      <div className="relative group border-gray-300 border">
        <Link to={`/product/${product.slug}`}>
          {product.images.length > 0 && (
            <div
              className={`w-full overflow-hidden pt-[100%] relative bg-gray-100 ${
                product.images.length > 1 ? "group" : ""
              }`}
            >
              <Image
                source={product.images[0].image}
                alt={product.name}
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                  product.images.length > 1 ? "group-hover:opacity-0" : ""
                }`}
                loading="lazy"
              />

              {product.images.length > 1 && (
                <Image
                  source={product.images[1].image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  loading="lazy"
                />
              )}
            </div>
          )}
        </Link>

        {product.discount > 0 && (
          <div className="absolute top-2 right-2 z-10 font-semibold text-center">
            <p className="text-white text-[0.8rem] px-2 py-1 bg-accent w-10 h-10 rounded-full text-center flex justify-center items-center">
              -{Math.floor((product.discount / product.price) * 100)}%
            </p>
          </div>
        )}

        {product.stock === 0 && (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-white p-1 font-medium bg-accent uppercase z-10">
            Hết hàng
          </p>
        )}
      </div>

      <div className="space-y-[6px]">
        <p className="font-medium line-clamp-2">
          {product.brand.name} - {product.category.name}
        </p>

        <h5 className="font-medium capitalize line-clamp-2">{product.name}</h5>

        {product.discount > 0 ? (
          <div className="flex gap-[12px]">
            <del className="text-[#707072] text-[1rem]">
              {product.price.toLocaleString("vi-VN")}₫
            </del>

            <h5 className="font-semibold text-accent">
              {(product.price - product.discount).toLocaleString("vi-VN")}₫
            </h5>
          </div>
        ) : (
          <h5 className="font-semibold text-accent">
            {product.price.toLocaleString("vi-VN")}₫
          </h5>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
