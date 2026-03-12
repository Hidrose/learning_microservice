import Image from "../../ui/Image";
type Props = {
  paymethod: string;
  setPaymethod: (value: string) => void;
};
function PaymentMethod({ paymethod, setPaymethod }: Props) {
  const paymethods = [
    {
      image: "/assets/cod.png",
      name: "Thanh toán khi nhận hàng",
      value: "cod",
    },
    {
      image: "/assets/momo.png",
      name: "Thanh toán bằng Momo",
      value: "momo",
    },
  ];

  return (
    <div className="space-y-[15px]">
      <h4>Phương thức thanh toán</h4>
      <div className="grid gap-[20px]">
        {paymethods.map((method, index) => (
          <div className="relative" key={index}>
            <input
              className="peer hidden"
              id={`paymethod-${method.value}`}
              type="radio"
              name="paymethod"
              checked={paymethod === method.value}
              onChange={() => setPaymethod(method.value)}
            />
            <span className="peer-checked:border-primary absolute right-4 top-1/2 box-content block h-2.5 w-2.5 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
            <label
              className="peer-checked:border-primary font-medium  items-center gap-[10px] peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border-2 border-gray-300 p-4"
              htmlFor={`paymethod-${method.value}`}
            >
              <Image
                source={method.image}
                className="w-[60px] rounded-lg border border-gray-300"
                loading="eager"
                alt=""
              />
              <span>{method.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethod;