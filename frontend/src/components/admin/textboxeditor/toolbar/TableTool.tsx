import { Editor } from "@tiptap/react";
import { memo, useState } from "react";
import { VscTable } from "react-icons/vsc";

function TableTool({ editor }: { editor: Editor | null }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [openTable, setOpenTable] = useState<boolean>(false);

  const toggleTable = () => {
    setOpenTable((prev) => !prev);
  };

  const handleHoverTableSize = (row: number | null, col: number | null) => {
    setHoveredRow(row);
    setHoveredCol(col);
  };

  const handleAddTable = (row: number, col: number) => {
    if (row !== null && col !== null) {
      editor
        ?.chain()
        .focus()
        .insertTable({
          rows: row + 1,
          cols: col + 1,
          withHeaderRow: false,
        })
        .run();
    }
    toggleTable();
  };

  return (
    <div
      className="relative"
      onMouseEnter={toggleTable}
      onMouseLeave={toggleTable}
    >
      <button
        type="button"
        title="Table"
        className="p-2 flex items-center justify-between hover:bg-gray-100 bg-gray-50"
      >
        <VscTable size={18} />
      </button>

      {openTable && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full min-w-max space-y-2 bg-white z-10 border border-gray-200 shadow-md p-2">
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 100 }).map((_, i) => {
              const row = Math.floor(i / 10);
              const col = i % 10;
              const isActive =
                hoveredRow !== null &&
                hoveredCol !== null &&
                row <= hoveredRow &&
                col <= hoveredCol;

              return (
                <div
                  key={`table-size-${i}`}
                  className={`w-4 h-4 border border-gray-300 cursor-pointer transition-colors 
                    ${isActive ? "bg-blue-200" : "hover:bg-blue-200"}`}
                  onMouseEnter={() => {
                    handleHoverTableSize(row, col);
                  }}
                  onClick={() => {
                    handleAddTable(row, col);
                    handleHoverTableSize(null, null);
                  }}
                ></div>
              );
            })}
          </div>

          <div className="text-[0.9rem] text-center">
            {hoveredCol ? hoveredCol + 1 : 0} x{" "}
            {hoveredRow ? hoveredRow + 1 : 0}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TableTool);
