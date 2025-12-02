import React, { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = async () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.removeEventListener("resize", handleResize);
  };

  useEffect(() => {
    handleResize();
  }, []);

  window.addEventListener("resize", handleResize);

  return { windowSize };
};
