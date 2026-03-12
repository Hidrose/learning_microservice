import { memo } from "react";
import { RiImageEditFill } from "react-icons/ri";
type Props = {
  InputId: string;
  onFileSelect: (file: File, imageIndex: number) => void;
  sizeIcon: number;
  imageIndex: number;
};

function InputImage1({ InputId, onFileSelect, sizeIcon, imageIndex }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file, imageIndex);
    e.target.value = "";
  };

  return (
    <div className="flex justify-center items-center bg-white rounded-full p-1.5 border border-gray-300">
      <label htmlFor={InputId} className="cursor-pointer">
        <RiImageEditFill size={sizeIcon} />
      </label>
      <input
        type="file"
        id={InputId}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default memo(InputImage1);
