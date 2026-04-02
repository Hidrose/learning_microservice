import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export function useInputImage(max: number = 1) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const allUrlsRef = useRef<string[]>([]);
  const orderedUrlsRef = useRef<string[]>([]);
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
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      allUrlsRef.current = allUrlsRef.current.filter((_, i) => i !== index);
      orderedUrlsRef.current = orderedUrlsRef.current.filter(
        (url) => url !== previewImages[index],
      );
    },
    [previewImages],
  );

  const handlePreviewImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const incomingFiles = Array.from(files);

      if (previewImages.length + incomingFiles.length > max) {
        if (max === 1 && incomingFiles.length === 1) {
          allUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
          allUrlsRef.current = [];
          orderedUrlsRef.current = [];

          const imageUrls = incomingFiles.map((file) =>
            URL.createObjectURL(file),
          );
          allUrlsRef.current.push(...imageUrls);
          orderedUrlsRef.current.push(...imageUrls);

          setPreviewImages(imageUrls);
          setSelectedFiles(incomingFiles);
          e.target.value = "";
          return;
        }

        toast.error(`Tổng số hình ảnh không được vượt quá ${max}.`);
        e.target.value = "";
        return;
      }

      const imageUrls = incomingFiles.map((file) => URL.createObjectURL(file));
      allUrlsRef.current.push(...imageUrls);
      orderedUrlsRef.current.push(...imageUrls);

      setPreviewImages((prev) => [...prev, ...imageUrls]);
      setSelectedFiles((prev) => [...prev, ...incomingFiles]);
      e.target.value = "";
    },
    [previewImages, max],
  );

  const handleReorder = useCallback((orderedUrls: string[]) => {
    orderedUrlsRef.current = orderedUrls;
  }, []);

  const getOrderedFiles = useCallback((): File[] => {
    const urls =
      orderedUrlsRef.current.length > 0
        ? orderedUrlsRef.current
        : allUrlsRef.current;

    return urls.map((url) => {
      const index = allUrlsRef.current.indexOf(url);
      return selectedFiles[index];
    });
  }, [selectedFiles]);

  const clearImages = useCallback(() => {
    allUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    allUrlsRef.current = [];
    orderedUrlsRef.current = [];
    setPreviewImages([]);
    setSelectedFiles([]);
  }, []);

  return {
    previewImages,
    setPreviewImages,
    handlePreviewImage,
    handleRemovePreviewImage,
    handleReorder,
    getOrderedFiles,
    clearImages,
  };
}
