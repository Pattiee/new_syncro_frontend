import { useEffect, useState } from "react"

export const useDebounce = ({ delay = 500, value = '' }) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay, value]);

    return { debouncedValue };
}