import type { CartItemResponse } from "../../../types/type";
import { Link } from "react-router-dom";
import Image from "../../ui/Image";
import { HiOutlineMinusSmall, HiOutlinePlusSmall } from "react-icons/hi2";
import { memo } from "react";
import { useRemoveItemInCart } from "../../../hooks/customer/cart/useRemoveItemInCart";
import { useChangeQuantityItemInCart } from "../../../hooks/customer/cart/useChangeQuantityItemInCart";
import toast from "react-hot-toast";

type Props = {
  item: CartItemResponse;
  userId: string;
};

function CartItem({ item, userId }: Props) {
  const max = 15;
  const { removeItem, isLoading: isLoadingRemove } = useRemoveItemInCart();
  const { changeQuantity, isLoading: isLoadingChangeQuantity } =
    useChangeQuantityItemInCart();

  const handleChangeQuantity = async (productId: string, quantity: number) => {
    await changeQuantity(userId, {
      productId: productId,
      quantity: quantity,
    });
  };

  const handleIncrement = (
    productId: string,
    currentQuantity: number,
    stock: number,
  ) => {
    const limit = stock > max ? max : stock; // số lượng tối đa có thể mua

    if (currentQuantity >= limit) {
      toast.error("Số lượng tối đa hiện có cho cuốn sách này là " + limit);
      return;
    }

    handleChangeQuantity(productId, currentQuantity + 1);
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) return;
    handleChangeQuantity(productId, currentQuantity - 1);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeItem(userId, productId);
  };
  return (
    <>
      <div className="w-full relative space-y-[20px]" key={item.productId}>
        <div className="flex gap-[10px] w-full sm:flex-row flex-col">
          <Link to={`/product/${item.slug}`} className="mx-auto bg-gray-100">
            <div className="w-[200px] h-[200px] overflow-hidden">
              <Image
                source={`${item.images[0]}`}
                alt={item.name}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </Link>

          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between gap-[15px]">
              <div className="flex flex-col gap-2">
                <h5 className="font-semibold">{item.name}</h5>

                {item.discount > 0 ? (
                  <div className="flex gap-[12px]">
                    <del className="text-[#707072] text-[1rem]">
                      {item.price.toLocaleString("vi-VN")}₫
                    </del>

                    <h5 className="font-medium text-accent">
                      {(item.price - item.discount).toLocaleString("vi-VN")}₫
                    </h5>
                  </div>
                ) : (
                  <h5 className="font-medium text-accent">
                    {item.price.toLocaleString("vi-VN")}₫
                  </h5>
                )}
              </div>

              <button
                data-testid="btn-remove"
                type="button"
                disabled={isLoadingRemove}
                onClick={() => handleRemoveItem(item.productId)}
                className="mb-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 cursor-pointer fill-black hover:fill-accent inline-block"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex-wrap justify-between flex gap-4 mt-auto">
              <div className="flex items-center gap-1">
                <button
                  data-testid="btn-decrement"
                  type="button"
                  onClick={() => handleDecrement(item.productId, item.quantity)}
                  disabled={item.quantity <= 1 || isLoadingChangeQuantity}
                  className="flex items-center justify-center w-7 h-7 outline-none bg-[#F7F7F7] border-gray-300 border"
                >
                  <HiOutlineMinusSmall size={20} />
                </button>
                <h5 className="flex items-center justify-center w-7 h-7">
                  {item.quantity}
                </h5>
                <button
                  data-testid="btn-increment"
                  type="button"
                  onClick={() =>
                    handleIncrement(item.productId, item.quantity, item.stock)
                  }
                  disabled={isLoadingChangeQuantity}
                  className="flex items-center justify-center w-7 h-7 outline-none bg-[#F7F7F7] border-gray-300 border"
                >
                  <HiOutlinePlusSmall size={20} />
                </button>
              </div>

              <h5 className="font-medium text-accent">
                {item.discount > 0
                  ? (
                      (item.price - item.discount) *
                      item.quantity
                    ).toLocaleString("vi-VN") + "₫"
                  : (item.price * item.quantity).toLocaleString("vi-VN") + "₫"}
              </h5>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-col">
          {item.stock < item.quantity && (
            <div>
              <p className="text-accent font-semibold text-center">
                Sản phẩm hiện tại không đủ số lượng. Vui lòng giảm số lượng hoặc
                xóa sản phẩm khỏi giỏ hàng!
              </p>
            </div>
          )}

          {item.status === 0 && (
            <div>
              <p className="text-accent font-semibold text-center">
                Sản phẩm đang tạm ngừng bán. Vui lòng xóa sản phẩm khỏi giỏ
                hàng!
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-300" />
    </>
  );
}

export default memo(CartItem);
