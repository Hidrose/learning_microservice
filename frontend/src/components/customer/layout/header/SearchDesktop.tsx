import { memo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import Suggestion from "../../ui/Suggestion";

function SearchDesktop() {
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

  return (
    <div className="relative w-full flex-1">
      <form
        onSubmit={handleSearch}
        className={`flex items-stretch w-ful overflow-hidden duration-200 border border-primary rounded-lg font-medium`}
      >
        <input
          type="text"
          className={`w-full px-3 py-2 text-[0.9rem] bg-transparent outline-none border-none`}
          required
          maxLength={100}
          placeholder="Bạn cần tìm gì..."
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setFocused(false);
            }, 200);
          }}
        />

        <button
          className="px-3 font-medium bg-primary text-white"
          type="submit"
        >
          <IoSearchOutline size={22} />
        </button>
      </form>

      {focused && search && (
        <div className="absolute top-[110%] left-0 w-full z-20 bg-white shadow-lg border border-gray-100 rounded-md py-2">
          <Suggestion search={search} />
        </div>
      )}
    </div>
  );
}

export default memo(SearchDesktop);
