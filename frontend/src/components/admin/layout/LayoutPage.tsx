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
    <div className="flex min-h-screen w-full relative bg-[#F1F4F9]">
      <MenuSide menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <main className="w-full">
        <Header onToggleMenu={toggleMenu} />
        {children}
      </main>
    </div>
  );
}

export default LayoutPage;
