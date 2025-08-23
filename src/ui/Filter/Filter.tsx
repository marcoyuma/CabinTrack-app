import styled, { css } from "styled-components";
import { useURL } from "../../hooks/useURL";

const StyledFilter = styled.div`
    border: 1px solid var(--color-grey-100);
    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-sm);
    border-radius: var(--border-radius-sm);
    padding: 0.4rem;
    display: flex;
    gap: 0.4rem;
`;

interface FilterButtonType {
    // props is not button properties
    $active: boolean;
}
const FilterButton = styled.button<FilterButtonType>`
    background-color: var(--color-grey-0);
    border: none;

    ${({ $active }) =>
        $active &&
        css`
            background-color: var(--color-brand-600);
            color: var(--color-brand-50);
        `}

    border-radius: var(--border-radius-sm);
    font-weight: 500;
    font-size: 1.4rem;
    /* To give the same height as select */
    padding: 0.44rem 0.8rem;
    transition: all 0.3s;

    &:hover:not(:disabled) {
        background-color: var(--color-brand-600);
        color: var(--color-brand-50);
    }
`;

interface FilterPropsType {
    filterField: string;
    options: { value: string; label: string }[];
}
export const Filter = ({ filterField, options }: FilterPropsType) => {
    // custom hooks for storing relevan value into url based on using useSearchParams hook
    const { valueFromParams, setParams } = useURL(filterField);

    const currentFilter = valueFromParams || options.at(0)?.value;
    console.log(currentFilter);

    // handle onClick event
    const handleClick = (value: string) => {
        // set url query key as 'discount' = 'value' into url
        setParams(value);
    };
    return (
        <StyledFilter>
            {options.map((value) => (
                <FilterButton
                    onClick={() => handleClick(value.value)}
                    key={value.value}
                    $active={currentFilter === value.value}
                    disabled={currentFilter === value.value}
                >
                    {value.label}
                </FilterButton>
            ))}
        </StyledFilter>
    );
};
