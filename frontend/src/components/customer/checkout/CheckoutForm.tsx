import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { validatePhone } from "../../../utils/validatePhone";
import useGetProvinces from "../../../hooks/customer/useGetProvincesVN";
import Image from "../../ui/Image";
import ProductBuyList from "./ProductBuyList";
import PaymentMethod from "./PaymentMethod";
import ShippingInfoForm from "./ShippingInfoForm";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import useGetCart from "../../../hooks/customer/cart/useGetCart";
import useAddOrder from "../../../hooks/customer/order/useAddOrder";
import usePaymentMomo from "../../../hooks/customer/payment/usePaymentMomo";
import Overplay from "../ui/Overplay";
import Loading from "../../ui/Loading";

function CheckoutForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullname: "",
    phone: "",
    speaddress: "",
    city: "",
    ward: "",
  });
  const [paymethod, setPaymethod] = useState<string>("");
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);

  const { provinces } = useGetProvinces();
  const { cart, isLoading: isLoadingCart, mutate: mutateCart } = useGetCart();
  const { addOrder, isLoading: isLoadingOrder } = useAddOrder();
  const { createPaymentMomo, isLoading: isLoadingPaymentMomo } =
    usePaymentMomo();

  // lấy những sản phẩm không đủ số lượng mua (số lượng mua > số lượng tồn kho)
  const outOfStockItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item) => item.quantity > item.stock);
  }, [cart?.items]);

  const unavailableItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item) => item.status === 0);
  }, [cart?.items]);

  useEffect(() => {
    if (isOrderPlaced) return;

    if (isLoadingCart) return;

    if (!cart?.items.length || !cart) {
      toast.error("Không có gì trong giỏ hết");
      navigate("/cart");
      return;
    }

    if (outOfStockItems.length > 0) {
      toast.error(
        "Một số sản phẩm không đủ hàng so với số lượng bạn muốn mua trong giỏ hàng",
      );
      navigate("/cart");
    }

    if (unavailableItems.length > 0) {
      toast.error("Một số sản phẩm đang tạm ngừng bán trong giỏ hàng");
      navigate("/cart");
    }
  }, [
    cart,
    outOfStockItems,
    unavailableItems,
    navigate,
    isOrderPlaced,
    isLoadingCart,
  ]);

  const totalPrice = useMemo(() => {
    return (
      cart?.items.reduce((sum, item) => {
        const finalPrice =
          item.discount > 0 ? item.price - item.discount : item.price;

        return sum + finalPrice * item.quantity;
      }, 0) || 0
    );
  }, [cart?.items]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    if (totalPrice < 10000 && paymethod === "momo") {
      toast.error(
        "Tổng giá trị đơn hàng của bạn dưới 10.000đ, nên bạn chỉ có thể chọn hình thức thanh toán khi nhận hàng",
      );
      setPaymethod("cod");
      return;
    }

    if (!cart?.items.length) {
      toast.error("Không có gì trong giỏ hết");
      navigate("/cart");
      return;
    }

    if (!validatePhone(data.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    const items = cart.items.map(
      ({ productId, quantity, price, discount }) => ({
        productId,
        quantity,
        price,
        discount,
      }),
    );

    const orderPayload = { ...data, paymethod, items };

    setIsOrderPlaced(true);

    try {
      const res = await addOrder(orderPayload);

      if (paymethod === "cod") {
        navigate("/order-result?result=successful");
        mutateCart({ items: [] }, false);
      } else {
        const momoResponse = await createPaymentMomo(res.orderCode);
        window.location.href = momoResponse.payUrl;
      }
    } catch (err: any) {
      setIsOrderPlaced(false);
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <section className="my-[40px] px-[15px] text-black">
      <div className="mx-auto max-w-[1200px] w-full">
        <Link to={"/"}>
          <Image
            source={"/assets/logo.png"}
            alt={"logo"}
            className={"w-[100px]"}
            loading="eager"
          />
        </Link>

        <hr className="border-gray-300 my-[15px]" />

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-[40px]">
            <div className="order-last lg:order-first space-y-[15px]">
              <div className="space-y-[30px]">
                <ShippingInfoForm
                  data={data}
                  setData={setData}
                  onChange={handleChange}
                  provinces={provinces ?? []}
                />

                <PaymentMethod
                  paymethod={paymethod}
                  setPaymethod={setPaymethod}
                />

                <div className="flex justify-between items-center">
                  <button className="text-[0.9rem] rounded-md bg-accent px-4 py-2 font-medium text-white">
                    Đặt hàng
                  </button>

                  <Link
                    to={"/cart"}
                    className="text-[0.95rem] rounded-md bg-transparent px-4 py-2 font-medium text-accent"
                  >
                    <div className="flex gap-[5px] items-center">
                      <MdOutlineKeyboardBackspace size={25} /> Giỏ hàng
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-first lg:order-last space-y-[15px] lg:sticky lg:top-0 lg:self-start">
              <ProductBuyList
                items={cart?.items ?? []}
                isLoading={isLoadingCart}
              />

              <hr className="border-gray-300" />

              <div className="flex items-center justify-between font-medium ">
                <h5>Phí giao hàng:</h5>
                <h5>Miễn phí</h5>
              </div>

              <div className="flex items-center justify-between font-semibold">
                <h5>Tổng cộng:</h5>
                <h5>{totalPrice.toLocaleString("vi-VN")}₫</h5>
              </div>
            </div>
          </div>
        </form>
      </div>

      {(isLoadingCart || isLoadingOrder || isLoadingPaymentMomo) && (
        <Overplay IndexForZ={50}>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát...</h4>
        </Overplay>
      )}
    </section>
  );
}

export default CheckoutForm;
