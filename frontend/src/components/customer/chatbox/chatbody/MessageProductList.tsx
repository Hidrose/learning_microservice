import { memo } from "react";
import Image from "../../../ui/Image";
import { Link } from "react-router-dom";

function MessageProductList({ products }: any) {
  return (
    <Link
      to={"/products"}
      className="inline-flex bg-white hover:bg-gray-100 border border-gray-200 rounded-xl p-2.5 cursor-pointer max-w-fit text-black"
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-2 ">
          {products.slice(0, 3).map((p: any, index: number) => (
            <div
              className="w-20 h-20 rounded-md overflow-hidden border border-gray-200 relative"
              key={p.id}
            >
              <Image
                source={p.image}
                alt={p.name}
                className="w-full object-cover"
                loading="eager"
              />

              {index === 2 && products.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white font-semibold">
                    +{products.length - 3}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="font-medium">Xem sản phẩm</p>
      </div>
    </Link>
  );
}

export default memo(MessageProductList);
