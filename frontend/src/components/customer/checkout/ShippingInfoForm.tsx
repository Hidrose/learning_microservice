import { memo, useMemo } from "react";
import type { Province } from "../../../types/type";

type Props = {
  data: {
    fullname: string;
    phone: string;
    speaddress: string;
    city: string;
    ward: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      fullname: string;
      phone: string;
      speaddress: string;
      city: string;
      ward: string;
    }>
  >;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  provinces: Province[];
};

function ShippingInfoForm({ data, setData, onChange, provinces }: Props) {
  const selectedProvince = useMemo(
    () => provinces?.find((p) => p.province === data.city),
    [provinces, data.city],
  );

  return (
    <div className="space-y-[15px]">
      <h4>Thông tin giao hàng</h4>

      <div className="space-y-[5px]">
        <label htmlFor="" className="block text-[0.9rem] font-medium">
          Họ tên
        </label>
        <input
          type="text"
          name="fullname"
          value={data.fullname}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-200 px-2.5 py-2 text-[0.9rem] outline-none focus:z-10 focus:border-[#197FB6] focus:ring-[#197FB6]"
          placeholder="Họ tên"
        />
      </div>

      <div className="space-y-[5px]">
        <label htmlFor="" className="block text-[0.9rem] font-medium">
          Số điện thoại
        </label>
        <input
          type="number"
          inputMode="numeric"
          name="phone"
          value={data.phone}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-200 px-2.5 py-2 text-[0.9rem] outline-none focus:z-10 focus:border-[#197FB6] focus:ring-[#197FB6]"
          placeholder="Số điện thoại"
        />
      </div>

      <div className="space-y-[5px]">
        <label htmlFor="" className="block text-[0.9rem] font-medium">
          Địa chỉ cụ thể
        </label>
        <input
          type="text"
          name="speaddress"
          value={data.speaddress}
          onChange={onChange}
          required
          className="w-full rounded-md border border-gray-200 px-2.5 py-2 text-[0.9rem] outline-none focus:z-10 focus:border-[#197FB6] focus:ring-[#197FB6]"
          placeholder="Địa chỉ cụ thể"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
        <div className="space-y-[5px]">
          <label htmlFor="" className="block text-[0.9rem] font-medium">
            Tỉnh/thành phố
          </label>
          <select
            name="city"
            required
            value={data.city}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                city: e.target.value,
                ward: "",
              }))
            }
            className="w-full rounded-md text-[0.9rem] border border-gray-200 px-2.5 py-2 outline-none focus:z-10 focus:border-[#197FB6] focus:ring-[#197FB6]"
          >
            <option value="">Chọn Tỉnh/thành phố</option>
            {provinces?.map((province) => (
              <option key={province.id} value={province.province}>
                {province.province}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-[5px]">
          <label htmlFor="" className="block text-[0.9rem] font-medium">
            Phường/xã
          </label>
          <select
            name="ward"
            required
            disabled={!selectedProvince}
            value={data.ward}
            onChange={onChange}
            className="w-full rounded-md text-[0.9rem] border border-gray-200 px-2.5 py-2 text-sm outline-none focus:z-10 focus:border-[#197FB6] focus:ring-[#197FB6]"
          >
            <option value="">Chọn Phường/xã</option>
            {selectedProvince?.wards.map((ward, idx) => (
              <option key={idx} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default memo(ShippingInfoForm);
