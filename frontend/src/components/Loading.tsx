import { ClipLoader } from "react-spinners";
type prop = {
  height: number;
  size: number;
  color: string;
  thickness: number;
};
function Loading({ height, color, size, thickness }: prop) {
  return (
    <div
      className="flex justify-center items-center"
      style={{ height: `${height}vh` }}
    >
      <ClipLoader
        color={color}
        size={size}
        cssOverride={{
          borderWidth: `${thickness}px`,
        }}
      />
    </div>
  );
}

export default Loading;
