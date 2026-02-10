import { memo } from "react";

type Props = {
  array: { title: string; number: number | string; icon1: React.ReactNode }[];
};
function StaticCard({ array }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {array.map((item, index) => (
        <div
          key={index}
          className="relative break-words rounded-lg border border-gray-200 h-[20vh] flex items-center justify-between px-4 bg-white"
        >
          <div className="space-y-3">
            <h5 className="font-medium">{item.title}</h5>
            <h4 className="font-semibold">{item.number}</h4>
          </div>

          <div className="w-14 h-14 bg-[#F1F4F9] flex justify-center items-center rounded-full">
            {item.icon1}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(StaticCard);