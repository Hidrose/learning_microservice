import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { key } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, [key]);

  return null;
};

export default ScrollToTop;
