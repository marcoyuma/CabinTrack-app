import styled from "styled-components";

type SelectType = { type?: "white" };
const StyledSelect = styled.select<SelectType>`
    font-size: 1.4rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid
        ${(props) =>
            props.type === "white"
                ? "var(--color-grey-100)"
                : "var(--color-grey-300)"};
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    font-weight: 500;
    box-shadow: var(--shadow-sm);
`;

interface SelectPropsType {
    options: { value: string; label: string }[];
    value: string;
}
export const Select = ({ options, value }: SelectPropsType) => {
    return (
        <StyledSelect value={value}>
            {options.map((option) => (
                <option value={option.value} key={option.value}>
                    {option.label}
                </option>
            ))}
        </StyledSelect>
    );
};
