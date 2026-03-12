function ProductDetailSkeleton() {
  return (
    <section className="w-full mb-[40px] px-[15px] animate-pulse">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col lg:flex-row gap-x-[15px] gap-y-[30px] w-full">
          <div className="flex-1/6">
            <div className="flex lg:flex-row flex-col-reverse gap-3">
              <div className="lg:max-w-[70px] w-full flex lg:flex-col flex-row gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[70px] h-[70px] bg-gray-200 rounded"
                  />
                ))}
              </div>

              <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gray-200 rounded" />
            </div>
          </div>

          <div className="flex-1 space-y-[15px]">
            <div className="h-6 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />

            <div className="h-6 w-40 bg-gray-200 rounded" />

            <div className="h-10 w-48 bg-gray-200 rounded" />

            <div className="h-11 w-full bg-gray-300 rounded" />

            <div className="space-y-3 mt-5">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>

            <div className="space-y-3 mt-5">
              <div className="h-5 w-32 bg-gray-200 rounded" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailSkeleton;
