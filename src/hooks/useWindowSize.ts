import { useEffect, useState } from "react";

// Structural interface defining the returned viewport window geometry dimensions
export interface WindowSizeDimensions {
  width: number;
  height: number;
}

export const useWindowSize = (): { windowSize: WindowSizeDimensions } => {
  const [windowSize, setWindowSize] = useState<WindowSizeDimensions>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Only execute if window object exists (prevents crashes during SSR/Next.js builds if migrated later)
    if (typeof window === "undefined") return;

    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Attach listener securely inside the side-effect lifecycle
    window.addEventListener("resize", handleResize);

    // Modern React cleanup function: Safely detaches listener automatically when unmounting
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this setup runs exactly once on mount

  return { windowSize };
};