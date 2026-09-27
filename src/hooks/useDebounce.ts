import { useEffect, useState } from "react";

// Define the shape of incoming config properties
export interface DebounceProps {
  delay?: number;
  value?: string;
}

// Define the precise type safe result layout contract
export interface DebounceResult {
  debouncedValue: string;
}

export const useDebounce = ({ 
  delay = 500, 
  value = '' 
}: DebounceProps = {}): DebounceResult => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return { debouncedValue };
};