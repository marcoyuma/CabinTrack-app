import { Select } from "../Select/Select";
import { ChangeEvent } from "react";

import { useBatchSearchParams } from "../../hooks/useBatchSearchParams";

// type for SortBy Component props
interface SortByPropsType {
    options: {
        value: string;
        label: string;
    }[];
}

// component for sorting data by specified options
export const SortBy = ({ options }: SortByPropsType) => {
    // custom hook for get and set value to url
    const [params, setParams] = useBatchSearchParams();

    const sortByParam = params.get("sortBy") || "";

    const handleClick = (e: ChangeEvent<HTMLSelectElement>) => {
        setParams({ sortBy: e.target.value });
        console.log(sortByParam);
    };
    return (
        <Select
            options={options}
            value={sortByParam}
            type="white"
            onChange={handleClick}
        />
    );
};
