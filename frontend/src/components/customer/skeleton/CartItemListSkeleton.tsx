import React from "react";
import { memo } from "react";
type Props = {
  count: number;
};

function CartItemListSkeleton({ count }: Props) {
  return (
    <section className="my-[40px] px-[15px] text-black animate-pulse">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex w-full gap-4 lg:flex-row flex-col">
          <div className="space-y-8 py-6 bg-white basis-[60%] h-full">
            {Array.from({ length: count }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="w-full space-y-[20px] animate-pulse">
                  <div className="flex gap-[10px] w-full sm:flex-row flex-col">
                    <div className="mx-auto bg-gray-200 w-[200px] h-[200px] rounded" />

                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex justify-between gap-[15px]">
                        <div className="flex flex-col gap-2 w-full">
                          <div className="h-5 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>

                        <div className="w-5 h-5 bg-gray-200 rounded" />
                      </div>

                      <div className="flex-wrap justify-between flex gap-4 mt-auto">
                        <div className="flex items-center gap-1">
                          <div className="w-7 h-7 bg-gray-200 rounded" />
                          <div className="w-7 h-7 bg-gray-200 rounded" />
                          <div className="w-7 h-7 bg-gray-200 rounded" />
                        </div>

                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-300" />
              </React.Fragment>
            ))}
          </div>

          <div className="bg-[#F7F7F7] rounded-sm px-4 py-6 h-auto basis-[40%] space-y-6">
            <div className="flex justify-between items-center">
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              <div className="h-6 w-1/4 bg-gray-200 rounded" />
            </div>

            <hr className="border-gray-300" />

            <div className="flex flex-col gap-3">
              <div className="h-10 w-full bg-gray-200 rounded-md" />
              <div className="h-10 w-full bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CartItemListSkeleton);
