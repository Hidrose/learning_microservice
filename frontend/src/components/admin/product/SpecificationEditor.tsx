import { ReactSortable } from "react-sortablejs";
import type { SpecificationResponse } from "../../../types/type";
import { memo } from "react";

type Props = {
  specifications: SpecificationResponse[];
  setSpecifications: React.Dispatch<
    React.SetStateAction<SpecificationResponse[]>
  >;
  addSpecification: () => void;
  removeSpecification: (id: string) => void;
  clearSpecifications?: () => void;
  updateSpecification: (
    id: string,
    field: "specKey" | "specValue",
    value: string,
  ) => void;
};

const SpecificationEditor = ({
  specifications,
  setSpecifications,
  addSpecification,
  removeSpecification,
  clearSpecifications,
  updateSpecification,
}: Props) => {
  return (
    <div className="sm:p-[25px] p-[15px] bg-white rounded-md flex flex-col gap-[25px] w-full">
      <div className="flex gap-[15px] justify-between items-center">
        <button
          type="button"
          onClick={addSpecification}
          className="border-0 cursor-pointer text-[0.9rem] font-medium p-[8px_12px] bg-[#E2EDFF] text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Thêm
        </button>

        {clearSpecifications && (
          <button
            type="button"
            onClick={clearSpecifications}
            className="bg-red-500 border-0 cursor-pointer text-[0.9rem] font-medium p-[6px_12px] text-white"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="bg-white w-full overflow-auto">
        <table className="border-collapse w-[180%] sm:w-[120%] lg:w-full">
          <thead>
            <tr className="text-left">
              <th className="text-[#444] text-[0.9rem] py-[1rem]">Tên</th>
              <th className="text-[#444] text-[0.9rem] py-[1rem]">Thông số</th>
              <th className="text-[#444] text-[0.9rem] py-[1rem]">Hành động</th>
            </tr>
          </thead>

          <ReactSortable
            tag="tbody"
            list={specifications}
            setList={setSpecifications}
            animation={150}
          >
            {specifications.map((spec) => (
              <tr key={spec.id} className="cursor-move">
                <td className="py-[1rem]">
                  <input
                    type="text"
                    required
                    value={spec.specKey}
                    onChange={(e) =>
                      updateSpecification(spec.id, "specKey", e.target.value)
                    }
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] outline-none focus:border-gray-400"
                  />
                </td>

                <td className="py-[1rem]">
                  <input
                    type="text"
                    required
                    value={spec.specValue}
                    onChange={(e) =>
                      updateSpecification(spec.id, "specValue", e.target.value)
                    }
                    className="border border-gray-300 p-[6px_10px] text-[0.9rem] outline-none focus:border-gray-400"
                  />
                </td>

                <td className="py-[1rem]">
                  <button
                    type="button"
                    onClick={() => removeSpecification(spec.id)}
                    className="bg-red-500 border-0 cursor-pointer text-[0.9rem] font-medium p-[6px_12px] text-white"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </ReactSortable>
        </table>
      </div>
    </div>
  );
};

export default memo(SpecificationEditor);
