
import { useCallback, useEffect, useState } from "react";

export const useInputImage1 = () => {
  const [previewImages1, setPreviewImages1] = useState<string[]>([]);
  const [selectedFiles1, setSelectedFiles1] = useState<File[]>([]);

  useEffect(() => {
    return () => {
      previewImages1.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages1]);

  const onFileSelect = useCallback((file: File, imageIndex: number) => {
    setPreviewImages1((prev) => {
      const updated = [...prev];
      if (updated[imageIndex]) {
        URL.revokeObjectURL(updated[imageIndex]);
      }
      updated[imageIndex] = URL.createObjectURL(file);
      return updated;
    });

    setSelectedFiles1((prev) => {
      const updated = [...prev];
      updated[imageIndex] = file;
      return updated;
    });
  }, []);

  const handleClear = useCallback((imageIndex: number) => {
    setPreviewImages1((prev) => {
      const updated = [...prev];
      if (updated[imageIndex]) {
        URL.revokeObjectURL(updated[imageIndex]);
        updated.splice(imageIndex, 1);
      }
      return updated;
    });

    setSelectedFiles1((prev) => {
      const updated = [...prev];
      if (updated[imageIndex]) {
        updated.splice(imageIndex, 1);
      }
      return updated;
    });
  }, []);

  return {
    previewImages1,
    setPreviewImages1,
    selectedFiles1,
    setSelectedFiles1,
    onFileSelect,
    handleClear,
  };
};
