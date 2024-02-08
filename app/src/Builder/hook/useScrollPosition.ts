import { useState, useEffect } from "react";

// Custom hook to get the current scroll position
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  const handleScroll = () => {
    // For window scroll position
    setScrollPosition({
      x: window.pageXOffset,
      y: window.pageYOffset,
    });
  };

  useEffect(() => {
    // Add scroll event listener to window
    window.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array means this effect runs only once on mount

  return scrollPosition;
};

export default useScrollPosition;
