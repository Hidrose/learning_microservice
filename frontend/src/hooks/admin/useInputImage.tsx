
import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export function useInputImage(max: number = 1) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const allUrlsRef = useRef<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    return () => {
      allUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      allUrlsRef.current = [];
    };
  }, [location.pathname]);

  const handleRemovePreviewImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previewImages[index]);

      const newImages = previewImages.filter((_, i) => i !== index);
      const newFiles = selectedFiles.filter((_, i) => i !== index);

      setPreviewImages(newImages);
      setSelectedFiles(newFiles);
      allUrlsRef.current = allUrlsRef.current.filter((_, i) => i !== index);
    },
    [previewImages, selectedFiles]
  );

  const handlePreviewImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const incomingFiles = Array.from(files);

      if (previewImages.length + incomingFiles.length > max) {
        toast.error(`Tổng số hình ảnh không được vượt quá ${max}.`);
        e.target.value = "";
        return;
      }

      const imageUrls = incomingFiles.map((file) => URL.createObjectURL(file));

      allUrlsRef.current.push(...imageUrls);

      setPreviewImages((prev) => [...prev, ...imageUrls]);
      setSelectedFiles((prev) => [...prev, ...incomingFiles]);
      e.target.value = "";
    },
    [previewImages, max]
  );

  return {
    previewImages,
    setPreviewImages,
    selectedFiles,
    setSelectedFiles,
    handlePreviewImage,
    handleRemovePreviewImage,
  };
}
