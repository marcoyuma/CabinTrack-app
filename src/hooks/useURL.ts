import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// custom hook for read and update url by using react router hook 'useSearchParams'
export const useURL = (nameParams: string) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const valueFromParams = searchParams.get(nameParams);
    const setParams = useCallback(
        (value: string) => {
            // Clone the current URLSearchParams to avoid mutating the original object,
            // update the given query parameter with the new value, then set the updated params back to the URL.
            const newParams = new URLSearchParams(searchParams);
            newParams.set(nameParams, value);
            setSearchParams(newParams);
        },
        [nameParams, searchParams, setSearchParams]
    );
    return { valueFromParams, setParams };
};
