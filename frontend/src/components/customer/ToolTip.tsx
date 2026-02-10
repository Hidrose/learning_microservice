import { memo, useLayoutEffect, useRef, useState } from "react";

type Props = {
  text: string;
};

function ToolTip({ text }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<"left" | "right">("left");
  const [vertical, setVertical] = useState<"top" | "bottom">("top");

  const positionClass = {
    left: "left-0",
    right: "right-0",
  }[position];

  const verticalClass = {
    top: "top-[-35px]",
    bottom: "bottom-[-35px]",
  }[vertical];

  useLayoutEffect(() => {
    const update = () => {
      const parent = ref.current?.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();

      if (parentRect.left > window.innerWidth / 2) {
        setPosition("right");
      } else {
        setPosition("left");
      }

      if (parentRect.top < 50) {
        setVertical("bottom");
      } else {
        setVertical("top");
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute z-50 px-2 py-0.5 bg-black text-white rounded-sm opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap font-medium pointer-events-none select-none ${positionClass} ${verticalClass}`}
    >
      <small className="text-[0.8rem]">{text}</small>

      <span
        className={`absolute w-[8px] h-[8px] bg-black rotate-45
          ${vertical === "top" ? "bottom-[-3px]" : "top-[-3px]"}
          ${position === "left" ? "left-3" : "right-3"}`}
      />
    </div>
  );
}

export default memo(ToolTip);
