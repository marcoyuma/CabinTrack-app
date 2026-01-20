import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

// custom hook for read and update url by using react router hook 'useSearchParams'
export const useURL = (name: string) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const valueFromParams = searchParams.get(name);
    const setParams = useCallback(
        (value: string) => {
            // // Clone the current URLSearchParams to avoid mutating the original object,
            // // update the given query parameter with the new value, then set the updated params back to the URL.
            // const newParams = new URLSearchParams(searchParams);
            // newParams.set(nameParams, value);
            // setSearchParams(newParams);
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set(name, value);
                return newParams;
            });
        },
        [name, setSearchParams]
    );
    return { valueFromParams, setParams };
};
