import { useEffect, useState } from "react"

function useDebounce ({ delay, value }) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        }
    }, [delay, value]);

    return debouncedValue;
}
export default useDebounce;