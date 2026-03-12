import { memo } from "react";

type Props = {
  count: number;
};

function ProductBuyListSkeleton({ count }: Props) {
  return (
    <div className="space-y-[15px] bg-white animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between rounded-lg bg-white gap-[15px]"
        >
          <div className="relative border border-gray-300 bg-gray-100">
            <div className="w-[120px] h-[120px] bg-gray-200 rounded" />

            <div className="absolute top-[-7px] right-[-9px] w-[25px] h-[25px] bg-gray-300 rounded-full" />
          </div>

          <div className="flex w-full flex-col my-auto gap-[10px]">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>

          <div className="h-5 w-20 bg-gray-200 rounded my-auto" />
        </div>
      ))}
    </div>
  );
}

export default memo(ProductBuyListSkeleton);
