import { memo, useState } from "react";
import { HiOutlineMinusSmall } from "react-icons/hi2";
import { HiOutlinePlusSmall } from "react-icons/hi2";
import type { ProductResponse } from "../../../../types/type";
import ProductGallery from "./ProductGallery";
import ProductInformation from "./ProductInformation";
import ProductDescription from "./ProductDescription";
import { useAddItemToCart } from "../../../../hooks/customer/cart/useAddItemToCart";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import useGetCart from "../../../../hooks/customer/cart/useGetCart";
import toast from "react-hot-toast";

type Props = {
  product: ProductResponse;
};

function ProductDetail({ product }: Props) {
  const max = 15;
  const [quantity, setQuantity] = useState<number>(1);

  const { account } = useGetAccount("customer");
  const { cart, mutate } = useGetCart();
  const { addItem, isLoading } = useAddItemToCart();

  const HandleIncrement = () => {
    const maxQuantity = product?.stock > max ? max : product?.stock;
    setQuantity((prev) => (prev < maxQuantity ? prev + 1 : prev));
  };

  const HandleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddItemToCart = async () => {
    if (product.stock === 0) {
      toast.error(`Sản phẩm đã hết hàng`);
      return;
    }

    if (!account?.id) {
      toast.error("Bạn phải đăng nhập để mua hàng");
      return;
    }

    const existingItem = cart?.items?.find(
      (item: any) => item.bookId === product.id,
    );

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    const maxQuantity = Math.min(product.stock, max);

    if (newQuantity > maxQuantity) {
      toast(`Sản phẩm này bạn chỉ có thể mua tối đa ${maxQuantity}`);
      return;
    }

    try {
      await addItem({
        productId: product.id,
        quantity,
      });
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <section className="w-full mb-[40px] px-[15px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-x-[15px] gap-y-[30px] w-full">
          <div className="flex-1/6" id="div1">
            <div className="lg:items-start items-center flex lg:flex-row flex-col-reverse gap-3 flex-1/6 lg:sticky lg:top-[100px]">
              <ProductGallery images={product.images} />
            </div>
          </div>

          <div className="relative flex-1" id="div2">
            <div className="space-y-[10px] ">
              <h2 className="line-clamp-2">{product?.name}</h2>

              <div className="flex items-center gap-[15px]">
                {product && product?.discount > 0 ? (
                  <>
                    <del className="text-[#707072] font-light text-[1.4rem]">
                      {product?.price.toLocaleString("vi-VN")}₫
                    </del>

                    <h3 className="text-[#FF4C58] font-medium">
                      {(product?.price - product?.discount).toLocaleString(
                        "vi-VN",
                      )}
                      ₫
                    </h3>

                    <p className="text-[#FF4C58] p-1.5 border border-[#FF4C58] rounded-sm font-semibold">
                      -{Math.floor((product.discount / product.price) * 100)}%
                    </p>
                  </>
                ) : (
                  <h3 className="font-medium text-[#FF4C58]">
                    {product?.price.toLocaleString("vi-VN")}₫
                  </h3>
                )}
              </div>

              <div className="space-y-[15px]">
                {product && product.stock > 0 ? (
                  <>
                    <div className="w-full flex items-center gap-[15px]">
                      <h5 className="font-medium">Số lượng:</h5>
                      <div className="relative flex justify-between items-center max-w-[8rem] border border-gray-300 rounded-sm">
                        <button
                          type="button"
                          onClick={HandleDecrement}
                          disabled={quantity <= 1}
                          className=" p-3 h-11 outline-none"
                        >
                          <HiOutlineMinusSmall size={22} />
                        </button>
                        <input
                          type="number"
                          name="quantity"
                          readOnly
                          className="h-11 text-center text-black w-11 outline-none placeholder:text-[1.2rem] font-medium"
                          placeholder="1"
                          min={1}
                          max={product?.stock > max ? max : product?.stock}
                          value={quantity}
                        />
                        <button
                          type="button"
                          onClick={HandleIncrement}
                          disabled={
                            quantity >=
                            (product?.stock > max ? max : product?.stock)
                          }
                          className=" p-3 h-11 outline-none"
                        >
                          <HiOutlinePlusSmall size={22} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleAddItemToCart}
                      data-testid="btn-add-to-cart"
                      className="p-[10px] w-full uppercase text-[0.9rem] font-semibold border border-blue-500 text-blue-500"
                    >
                      Thêm vào giỏ
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="p-[10px] w-full uppercase text-[0.9rem] font-semibold border bg-transparent border-[#FF4C58] text-[#FF4C58]"
                  >
                    Hết hàng
                  </button>
                )}

                <ProductInformation
                  category={product.category}
                  specifications={product.specifications}
                />

                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductDetail);
