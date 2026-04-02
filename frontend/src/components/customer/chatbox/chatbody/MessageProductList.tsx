import { memo } from "react";
import Image from "../../../ui/Image";
import { Link } from "react-router-dom";
import type { ProductListItemResponse } from "../../../../types/type";
import ToolTip from "../../ui/ToolTip";

type Props = {
  products: ProductListItemResponse[];
};

function MessageProductList({ products }: Props) {
  console.log(products);

  return (
    <div className="inline-flex border-gray-200 cursor-pointer max-w-fit text-black">
      <div className="grid grid-cols-3 gap-2">
        {products.map((p) => (
          <div key={p.id} className="relative group flex gap-2">
            <ToolTip text={p.name} />

            <Link
              to={`/product/${p.slug}`}
              className="block w-24 h-24 rounded-md overflow-hidden border border-gray-200"
            >
              <Image
                source={p.images[0].image}
                alt={p.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MessageProductList);
