import { ChangeEvent } from "react";
import styled from "styled-components";
import { Option } from "../Option/Option";

// Props used internally for styling the select element.
type StyledSelectPropsType = { $variation?: "white"; $fullwidth: boolean };
// Styled wrapper around the native select element.
const StyledSelect = styled.select<StyledSelectPropsType>`
    font-size: 1.4rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid
        ${(props) =>
            props.$variation === "white"
                ? "var(--color-grey-100)"
                : "var(--color-grey-300)"};
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    font-weight: 500;
    box-shadow: var(--shadow-sm);
    width: ${({ $fullwidth }) => ($fullwidth ? "100%" : "auto")};
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    display: block;
`;

// Public props accepted by the Select component.
interface SelectPropsType {
    defaultPlaceholder: string;
    value: number | string;
    type?: "white";
    options: { value: string; label: string }[];
    $fullwidth?: boolean;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}
/**
 * Reusable select input with a placeholder option and configurable list options.
 *
 * @param {SelectPropsType} props - Component props.
 * @param {string} props.defaultPlaceholder - Placeholder text shown as the first option.
 * @param {number | string} props.value - Currently selected value.
 * @param {"white"} [props.type] - Optional visual variation.
 * @param {{ value: string; label: string }[]} props.options - Options rendered in the dropdown.
 * @param {boolean} [props.$fullwidth] - Sets the select width to full container width when true.
 * @param {boolean} [props.disabled] - Disables the select input.
 * @param {(e: ChangeEvent<HTMLSelectElement>) => void} props.onChange - Handler called on value change.
 */
export function Select({
    defaultPlaceholder,
    value,
    type,
    options,
    $fullwidth,
    disabled,
    onChange,
}: SelectPropsType) {
    return (
        <StyledSelect
            value={value}
            $variation={type}
            onChange={onChange}
            $fullwidth={$fullwidth ?? true}
            disabled={disabled}
        >
            {disabled ? (
                <Option value="">{defaultPlaceholder}</Option>
            ) : (
                <>
                    <Option value="" disabled hidden>
                        {defaultPlaceholder}
                    </Option>
                    {options.map((option) => (
                        <Option value={option.value} key={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </>
            )}
        </StyledSelect>
    );
}
