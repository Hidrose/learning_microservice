import { type ReactNode, useEffect, useState } from "react";
import Header from "./header/Header";
import MenuSide from "./MenuSide";

type LayoutProps = {
  children: ReactNode;
};

function LayoutPage({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMenuOpen(false);
      } else {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex h-screen w-full relative overflow-auto bg-[#F1F4F9]">
      <MenuSide menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <main className="w-full overflow-y-auto">
        <Header onToggleMenu={toggleMenu} />
        {children}
      </main>
    </div>
  );
}

export default LayoutPage;
