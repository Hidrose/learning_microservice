import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Suggestion from "../../Suggestion";

type Props = {
  onToggleSearch: () => void;
  searchOpen: boolean;
};

function SearchMobile({ onToggleSearch, searchOpen }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = search.trim();
    if (!query) return;

    const isProductsPage = location.pathname.startsWith("/products");

    const target = isProductsPage
      ? `${location.pathname}?q=${encodeURIComponent(query)}`
      : `/products/all?q=${encodeURIComponent(query)}`;

    navigate(target);
    setSearch("");
  };
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  return (
    <div
      className={`absolute left-0 w-full bg-white border-t border-gray-300 transition-all duration-300 overflow-hidden font-medium ${
        searchOpen
          ? "opacity-100 visible top-full"
          : "opacity-0 invisible top-[90px]"
      }`}
    >
      <div className="relative">
        <div className="flex items-center px-[15px] py-4">
          <form onSubmit={handleSearch} className="w-full">
            <input
              type="text"
              required
              placeholder="Bạn cần tìm gì..."
              maxLength={50}
              autoComplete="off"
              className="w-full rounded outline-none text-[0.9rem]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setFocused(false);
                }, 200);
              }}
            />
          </form>

          <button onClick={onToggleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x w-3"
              viewBox="5 5 14 14"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        {focused && search && (
          <div className="fixed left-1/2 translate-x-[-50%] z-12 w-full bg-white shadow-lg border-gray-300 border">
            <Suggestion search={search} />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchMobile);
