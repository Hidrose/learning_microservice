import { memo, useEffect, useRef, useState } from "react";

type Props = {
  description: string;
};

function ProductDescription({ description }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const maxHeight = 200;

  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setCanExpand(contentRef.current.scrollHeight > maxHeight);
    }
  }, [description]);

  return (
    <div ref={wrapperRef} className="text-black space-y-[15px]">
      <h4>Mô tả</h4>

      <div
        ref={contentRef}
        className={`main-prose relative transition-all duration-300 ${
          !expanded && canExpand ? "overflow-hidden" : ""
        }`}
        style={!expanded && canExpand ? { maxHeight } : undefined}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: description || "",
          }}
        />

        {!expanded && canExpand && (
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {canExpand && (
        <button
          type="button"
          onClick={() => {
            setExpanded((prev) => {
              if (prev && wrapperRef.current) {
                wrapperRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
              return !prev;
            });
          }}
          className="text-blue-600 text-[0.9rem] font-medium text-center w-full"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

export default memo(ProductDescription);
