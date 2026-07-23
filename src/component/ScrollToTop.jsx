import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position to the top synchronously whenever the route
// changes, before the browser paints. This must be instant (not animated)
// so the new page never flashes at the previous page's scroll offset.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
