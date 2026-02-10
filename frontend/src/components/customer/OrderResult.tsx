import { useLocation, useNavigate } from "react-router-dom";
import Image from "../Image";
import { useEffect } from "react";
function OrderResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const status = searchParams.get("status");

  useEffect(() => {
    if (!status) {
      navigate("/", { replace: true });
    }
  }, [status, navigate]);

  if (!status) return null;
  return (
    <section className="my-[40px] px-[15px]">
      <div className="mx-auto max-w-[1200px] w-full">
        <div className="flex justify-center items-center h-[40vh] text-center">
          {status === "successful" ? (
            <div className="flex flex-col justify-center items-center gap-[15px]">
              <Image
                source={"/assets/successful.png"}
                alt={""}
                className={"w-[100px]"}
                loading="eager"
              />
              <h4 className="uppercase text-center">Đặt hàng thành công</h4>
              <p className="font-medium">
                Cảm ơn Quý khách đã mua hàng tại shop của chúng tôi
              </p>
              <p className="font-medium">
                Chúng tôi đã nhận được thông tin đơn hàng của bạn và sẽ liên hệ
                với bạn trong thời gian sớm nhất
              </p>
            </div>
          ) : status === "fail" ? (
            <div className="flex flex-col justify-center items-center gap-[15px]">
              <Image
                source={"/assets/fail.png"}
                alt={""}
                className={"w-[120px]"}
                loading="eager"
              />
              <h4 className="uppercase text-center">Đặt hàng thất bại</h4>
              <p className="font-medium">
                Rất tiếc, chúng tôi không thể xử lý đơn hàng của bạn
              </p>
              <p className="font-medium">
                Một hoặc nhiều sản phẩm trong đơn hàng đã hết hàng. Số tiền bạn
                đã thanh toán đã được hoàn lại.
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}

export default OrderResult;
