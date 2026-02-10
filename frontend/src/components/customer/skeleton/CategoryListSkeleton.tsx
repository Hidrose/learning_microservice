type Props = {
  count: number;
};

function CategoryListSkeleton({ count }: Props) {
  return (
    <aside className="w-auto sticky top-[80px] max-h-fit lg:block hidden lg:my-4 my-0 bg-white">
      <div className="p-[12px_8px]">
        <ul className="space-y-2 animate-pulse">
          {Array.from({ length: count }).map((_, index) => (
            <li key={index}>
              <div className="p-[7px_16px]">
                <div className="flex items-center gap-3">
                  <div className="w-[25px] h-[25px] rounded bg-gray-200" />

                  <div className="h-4 w-[80px] bg-gray-200 rounded" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default CategoryListSkeleton;
