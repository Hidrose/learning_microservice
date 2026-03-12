import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { memo, useState } from "react";
import useLogin from "../../../../hooks/auth/useLogin";
import toast from "react-hot-toast";
import useGetAccount from "../../../../hooks/auth/useGetAccount";
import Overplay from "../../ui/Overplay";
import Loading from "../../../ui/Loading";

type Props = {
  onClose: () => void;
  onSwitchRegister: () => void;
};

function LoginModal({ onClose, onSwitchRegister }: Props) {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { handleLogin, isLoading } = useLogin();
  const { isLoading: isLoadingAccount, mutate } = useGetAccount("customer");

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleLogin({
        email: data.email,
        password: data.password,
      });

      await mutate();

      toast.success("Đăng nhập thành công");

      setData({
        email: "",
        password: "",
      });

      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-99 flex items-center justify-center overflow-y-auto text-black">
        <div className="px-[15px] w-full">
          <div className="relative w-full max-w-md mx-auto pointer-events-auto">
            <div className="relative p-[25px_15px] bg-white z-20 space-y-[15px] rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="uppercase">Đăng nhập</h4>

                <button
                  onClick={onClose}
                  type="button"
                  className="bg-transparent ms-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x-icon lucide-x w-4"
                    viewBox="5 5 14 14"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>

              <hr className="border-gray-300" />

              <form className="space-y-[15px]" onSubmit={handleSubmit}>
                <div className="space-y-[5px]">
                  <label
                    htmlFor=""
                    className="block   text-[0.9rem] font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="text-[0.9rem] block w-full px-3 py-2 border border-gray-200"
                    placeholder="Nhập email"
                    required
                  />
                </div>

                <div className="space-y-[5px]">
                  <label htmlFor="" className="block text-[0.9rem] font-medium">
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={!showPassword ? "password" : "text"}
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu"
                      className="text-[0.9rem] block w-full  px-3 pr-12 py-2 border border-gray-200"
                      required
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={toggleShowPassword}
                    >
                      {!showPassword ? (
                        <HiOutlineEye size={22} />
                      ) : (
                        <HiOutlineEyeOff size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-primary text-white focus:outline-none font-semibold rounded-sm text-[0.9rem] uppercase px-5 py-2.5 text-center"
                >
                  Đăng nhập
                </button>

                <p className="flex gap-1.5 justify-center font-medium">
                  Bạn chưa có tài khoản ư?
                  <button
                    onClick={onSwitchRegister}
                    type="button"
                    className="text-primary font-medium"
                  >
                    Đăng kí
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {(isLoading || isLoadingAccount) && (
        <Overplay IndexForZ={99}>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
        </Overplay>
      )}
    </>
  );
}

export default memo(LoginModal);
