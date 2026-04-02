import { useState, useRef, useEffect, memo } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type Option = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full cursor-pointer" ref={containerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={`border p-[6px_10px] flex items-center justify-between w-full ${open ? "border-gray-400" : "border-gray-300"}`}
      >
        <p>{selectedOption ? selectedOption.label : placeholder}</p>
        <MdKeyboardArrowDown size={18} />
      </div>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 shadow-md max-h-60 overflow-y-auto">
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-b border-gray-300 p-[6px_10px] text-[0.9rem] w-full outline-none"
            />
          </div>

          {filteredOptions.length === 0 && (
            <p className="p-[6px_10px]">Không tìm thấy</p>
          )}

          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
                setSearch("");
              }}
              className="p-[6px_10px] text-[0.9rem] hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(SearchableSelect);
