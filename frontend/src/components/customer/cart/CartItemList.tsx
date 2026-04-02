import { memo, useMemo } from "react";
import type { CartResponse } from "../../../types/type";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../ui/Image";
import toast from "react-hot-toast";
import CartItem from "./CartItem";
import CartItemListSkeleton from "../skeleton/CartItemListSkeleton";

type Props = {
  cart: CartResponse;
  isLoading: boolean;
};

function CartItemList({ cart, isLoading = false }: Props) {
  const navigate = useNavigate();

  const totalQuantity = useMemo(() => {
    return (
      cart?.items.reduce((sum, item) => {
        return sum + (item?.quantity || 0);
      }, 0) || 0
    );
  }, [cart?.items]);

  const totalPrice = useMemo(() => {
    return (
      cart?.items.reduce((sum, item) => {
        const finalPrice =
          item.discount > 0 ? item.price - item.discount : item.price;

        return sum + finalPrice * item.quantity;
      }, 0) || 0
    );
  }, [cart?.items]);

  // lấy những sản phẩm không đủ số lượng mua (số lượng mua > số lượng tồn kho)
  const outOfStockItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item) => item.quantity > item.stock);
  }, [cart?.items]);

  const unavailableItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item) => item.status === 0);
  }, [cart?.items]);

  const handleCheckout = () => {
    if (cart?.items.length === 0) {
      toast.error("Không có gì trong giỏ hết");
      navigate("/cart");
      return;
    }

    if (outOfStockItems.length > 0) {
      toast.error(
        "Một số sản phẩm không đủ hàng so với số lượng bạn muốn mua trong giỏ hàng",
      );
      navigate("/cart");
      return;
    }

    if (unavailableItems.length > 0) {
      toast.error("Một số sản phẩm đang tạm ngừng bán trong giỏ hàng");
      navigate("/cart");
      return;
    }

    navigate("/checkout");
  };

  return (
    <section className="my-[40px] px-[15px] text-black">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="mb-[20px]">Giỏ hàng ({totalQuantity})</h2>
        {isLoading ? (
          <CartItemListSkeleton count={2} />
        ) : cart?.items && cart.items.length > 0 ? (
          <div className="flex w-full gap-4 lg:flex-row flex-col">
            <div className="space-y-8 py-6 bg-white basis-[60%] h-full">
              {cart?.items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  userId={cart.userId!}
                />
              ))}
            </div>

            <div className="bg-[#F7F7F7] rounded-sm px-4 py-6 h-auto basis-[40%]">
              <div className="flex justify-between items-center">
                <h4>Tổng cộng</h4>
                <h4 className="text-accent">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </h4>
              </div>

              <hr className="border-gray-300 my-[20px]" />

              <div className="flex md:flex-row flex-col justify-between items-center gap-[10px]">
                <button
                  onClick={handleCheckout}
                  type="submit"
                  className="text-[0.9rem] px-4 py-2.5 w-full font-semibold tracking-wide bg-accent text-white rounded-md"
                >
                  Thanh toán
                </button>

                <Link
                  className="text-[0.9rem] px-4 py-2.5 w-full tracking-wide bg-transparent hover:bg-gray-200 text-slate-900 border border-gray-300 rounded-md text-center font-semibold"
                  to={"/products"}
                >
                  Tiếp tục mua hàng
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col justify-center items-center gap-[15px]">
              <Image
                source={"/assets/empty-cart.png"}
                alt={""}
                className={"w-[130px]"}
                loading="eager"
              />

              <h4>Không có gì trong giỏ hết</h4>

              <Link
                to={"/products/all"}
                className="text-[0.9rem] border-2 uppercase border-primary rounded-md font-semibold px-3 py-2 hover:bg-primary text-primary hover:text-white"
              >
                Mua hàng ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(CartItemList);
