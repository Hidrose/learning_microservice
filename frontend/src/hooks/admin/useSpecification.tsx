import { useCallback, useEffect, useState } from "react";
import type { SpecificationResponse } from "../../types/type";

type UseSpecificationOptions = {
  initialSpecifications?: SpecificationResponse[];
  autoCreateEmpty?: boolean;
};

const createEmptySpec = (order: number): SpecificationResponse => ({
  id: crypto.randomUUID(),
  specKey: "",
  specValue: "",
  displayOrder: order,
});

export const useSpecification = ({
  initialSpecifications = [],
  autoCreateEmpty = false,
}: UseSpecificationOptions = {}) => {
  const [specifications, setSpecifications] = useState<SpecificationResponse[]>(
    initialSpecifications,
  );

  useEffect(() => {
    if (autoCreateEmpty && specifications.length === 0) {
      setSpecifications([createEmptySpec(1)]);
    }
  }, [autoCreateEmpty, specifications.length]);

  const addSpecification = useCallback(() => {
    setSpecifications((prev) => [...prev, createEmptySpec(prev.length + 1)]);
  }, []);

  const removeSpecification = useCallback(
    (id: string) => {
      setSpecifications((prev) => {
        const next = prev
          .filter((s) => s.id !== id)
          .map((s, index) => ({ ...s, displayOrder: index + 1 }));

        if (autoCreateEmpty && next.length === 0) {
          return [createEmptySpec(1)];
        }

        return next;
      });
    },
    [autoCreateEmpty],
  );

  const updateSpecification = useCallback(
    (id: string, field: "specKey" | "specValue", value: string) => {
      setSpecifications((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      );
    },
    [],
  );

  const clearSpecifications = useCallback(() => {
    setSpecifications(autoCreateEmpty ? [createEmptySpec(1)] : []);
  }, [autoCreateEmpty]);

  return {
    specifications,
    setSpecifications,
    addSpecification,
    removeSpecification,
    updateSpecification,
    clearSpecifications,
  };
};
