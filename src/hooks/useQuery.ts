import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useQuery(): URLSearchParams {
  const { search } = useLocation();
  
  // Wrapping in useMemo is a standard React performance optimization. 
  // It guarantees a fresh URLSearchParams instance is built ONLY when the URL search string actually updates.
  return useMemo(() => new URLSearchParams(search), [search]);
}