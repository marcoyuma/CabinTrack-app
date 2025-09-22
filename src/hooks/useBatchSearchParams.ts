import { useSearchParams } from "react-router-dom";

// type for 'updates' props type
export type SetManyParamsPropsType = Record<string, string | null | undefined>;

// custom hooks for setting new params value into url
export const useBatchSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const setManyParams = (
        // ...updates: Record<string, string | null | undefined>[]
        ...updates: SetManyParamsPropsType[]
    ) => {
        // create a new instance of URLSearchParams based on current searchParams
        const next = new URLSearchParams(searchParams);
        for (const element of updates) {
            console.log(element);
            // iterate through each key value pair in the object
            Object.entries(element).forEach(([key, value]) => {
                // delete the key when 'value' met the condition or set 'key' and 'value' into 'next'
                if (value == null) {
                    next.delete(key);
                } else {
                    next.set(key, value);
                }
            });
        }
        // set 'next' params values into url
        setSearchParams(next);
    };

    return [searchParams, setManyParams] as const;
};
