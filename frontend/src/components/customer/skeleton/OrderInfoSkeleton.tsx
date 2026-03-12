function OrderInfoSkeleton() {
  return (
    <div className="w-full flex-1 border border-gray-300 animate-pulse">
      <div className="flex justify-between px-[20px] py-[20px] border-b border-gray-300">
        <div className="flex flex-col gap-[10px] w-1/2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>

        <div className="h-5 w-24 bg-gray-200 rounded self-start" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 py-[20px] px-[20px] border-b border-gray-300">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-[10px]">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="px-[20px] space-y-[10px] py-[20px] border-b border-gray-300">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
        <div className="h-4 w-56 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="px-[20px] py-[20px] space-y-[20px]">
        <div className="grid grid-cols-4 gap-[20px]">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
        </div>

        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="grid grid-cols-4 gap-[20px] items-center">
            <div className="flex items-center gap-[10px]">
              <div className="w-[75px] h-[75px] bg-gray-200 rounded" />
              <div className="space-y-[8px] w-full">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        ))}

        <div className="h-4 w-40 bg-gray-200 rounded ml-auto" />
        <div className="h-5 w-48 bg-gray-200 rounded ml-auto" />
      </div>
    </div>
  );
}

export default OrderInfoSkeleton;
