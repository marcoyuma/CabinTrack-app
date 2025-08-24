import { Select } from "../Select/Select";
import { ChangeEvent } from "react";
import { useURL } from "../../hooks/useURL";

// type for SortBy Component props
interface SortByPropsType {
    options: {
        value:
            | "name-asc"
            | "name-desc"
            | "regularPrice-asc"
            | "regularPrice-desc"
            | "maxCapacity-asc"
            | "maxCapacity-desc";
        label: string;
    }[];
}

// component for sorting data by specified options
export const SortBy = ({ options }: SortByPropsType) => {
    // destructured custom hook that using 'useSearchParams'
    const { setParams, valueFromParams } = useURL("sortBy");

    const sortBy = valueFromParams || "";

    const handleClick = (e: ChangeEvent<HTMLSelectElement>) => {
        setParams(e.target.value);
        console.log(valueFromParams);
    };
    return (
        <Select
            options={options}
            value={sortBy}
            type="white"
            onChange={handleClick}
        />
    );
};
