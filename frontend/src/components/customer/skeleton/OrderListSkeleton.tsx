import { memo } from "react";
type Props = {
  count: number;
};

function OrderListSkeleton({ count }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, orderIndex) => (
        <div
          key={orderIndex}
          className="border border-gray-300 px-[15px] animate-pulse"
        >
          <div className="space-y-[10px] py-[15px] border-b border-gray-300">
            <div className="flex justify-between">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-5 w-28 bg-gray-200 rounded" />
            </div>

            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>

          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="py-[15px] items-center border-b border-gray-300 flex gap-[10px]"
            >
              <div className="w-[120px] h-[120px] bg-gray-200 rounded" />

              <div className="flex-1 space-y-4">
                <div className="h-5 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}

          <div className="py-[15px] flex justify-between items-center">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-8 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

export default memo(OrderListSkeleton);
