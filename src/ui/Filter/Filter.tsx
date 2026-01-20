import styled, { css } from "styled-components";
import { useBatchSearchParams } from "../../hooks/useBatchSearchParams";

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

    /* why not use props.active? because 'active' is a reserved word in HTML attribute. So we use $active instead. */
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
    paramToReset?: Record<string, string>;
}
export const Filter = ({
    filterField,
    options,
    paramToReset,
}: FilterPropsType) => {
    // custom hook for get and set value to url
    const [params, setParams] = useBatchSearchParams();

    // const currentFilter = valueFromParams || options.at(0)?.value;
    const currentFilter = params.get(filterField) || options.at(0)?.value;

    // handle onClick event
    const handleClick = (value: string) => {
        if (!value) return;

        // set the filterField to value, and reset other search params to default value
        if (paramToReset) {
            setParams({ [filterField]: value }, paramToReset);
        }

        // or just update the params
        else {
            setParams({ [filterField]: value });
        }
        console.log(value);
    };
    return (
        <StyledFilter>
            {options.map((option) => (
                <FilterButton
                    onClick={() => handleClick(option.value)}
                    key={option.value}
                    $active={currentFilter === option.value}
                    disabled={currentFilter === option.value}
                >
                    {option.label}
                </FilterButton>
            ))}
        </StyledFilter>
    );
};
