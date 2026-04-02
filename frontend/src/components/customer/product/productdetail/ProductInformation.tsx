import { memo } from "react";
import type {
  SpecificationResponse,
} from "../../../../types/type";

type Props = {
  categoryName: string;
  brandName: string
  specifications: SpecificationResponse[];
};
function ProductInformation({ categoryName, brandName, specifications }: Props) {
  return (
    <div className="text-black space-y-[15px]">
      <h4>Thông tin chi tiết</h4>

      <div className="divide-y divide-gray-200 text-[0.9rem]">
        <div className="grid grid-cols-2 gap-2 py-2">
          <span>Danh mục</span>
          <span className="font-medium">{categoryName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 py-2">
          <span>Thương hiệu</span>
          <span className="font-medium">{brandName}</span>
        </div>

        {specifications.map((spec) => (
          <div className="grid grid-cols-2 gap-2 py-2" key={spec.id}>
            <span>{spec.specKey}</span>
            <span className="font-medium">{spec.specValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ProductInformation);
