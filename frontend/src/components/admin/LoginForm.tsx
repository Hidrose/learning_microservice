import Image from "../Image";
import { useState } from "react";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import Loading from "../Loading";
import Overplay from "./Overplay";
import useLogin from "../../hooks/auth/useLogin";
import toast from "react-hot-toast";
function LoginForm() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { handleLogin, isLoading } = useLogin();

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

      setData({
        email: "",
        password: "",
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <>
      <section className="bg-[#F1F4F9] w-full">
        <div className="flex justify-center items-center h-screen sm:px-[15px] px-[10px]">
          <div className="relative bg-white rounded-lg shadow-md border border-gray-300 max-w-[850px] w-full h-[500px]">
            <div className="h-full grid grid-cols-1 sm:grid-cols-2 items-center">
              <div className="w-full px-4 sm:px-8 bg-white">
                <h1 className="relative text-center uppercase mb-6">
                  Đăng nhập
                </h1>

                <form className="space-y-[15px]" onSubmit={handleSubmit}>
                  <div className="space-y-[5px]">
                    <label
                      htmlFor=""
                      className="block text-[0.9rem] font-medium"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      className="text-[0.9rem] block w-full px-3 py-2 outline-none border border-gray-300"
                      placeholder="Nhập email"
                      required
                    />
                  </div>

                  <div className="space-y-[5px]">
                    <label
                      htmlFor=""
                      className="block text-[0.9rem] font-medium"
                    >
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <input
                        type={!showPassword ? "password" : "text"}
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                        className="text-[0.9rem] block w-full px-3 pr-12 py-2 outline-none border border-gray-300"
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
                    className="w-full bg-blue-500 text-[0.9rem] text-white focus:outline-none font-semibold rounded-sm px-5 py-2.5 text-center mt-6"
                  >
                    Đăng nhập
                  </button>
                </form>
              </div>

              <div className="hidden sm:block border-l-2 border-gray-200 sm:px-2">
                <Image
                  source={"/assets/hero1.png"}
                  alt={""}
                  className={"w-auto"}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <Overplay>
          <Loading height={0} size={55} color="white" thickness={8} />
          <h4 className="text-white">Vui lòng chờ trong giây lát ...</h4>
        </Overplay>
      )}
    </>
  );
}

export default LoginForm;
