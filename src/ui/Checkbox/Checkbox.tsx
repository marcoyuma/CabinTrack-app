import { InputHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

const StyledCheckbox = styled.div`
    display: flex;
    gap: 1.6rem;

    & input[type="checkbox"] {
        height: 2.4rem;
        width: 2.4rem;
        outline-offset: 2px;
        transform-origin: 0;
        accent-color: var(--color-brand-600);
    }

    & input[type="checkbox"]:disabled {
        accent-color: var(--color-brand-600);
    }

    & label {
        flex: 1;

        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
`;

/**
 * Reusable checkbox wrapper for form screens.
 *
 * Designed to work with native input props (including React Hook Form's
 * `register()` output), while keeping label + spacing consistent.
 */
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * Controlled state support.
     * Omit this prop if you want uncontrolled behavior.
     */
    checked?: boolean;
    disabled?: boolean;
    /** Used by both `input#id` and `label[htmlFor]` for accessibility. */
    id: string;
    /** Label/content displayed next to the checkbox. */
    children: ReactNode;
}

/**
 * Checkbox with opinionated styling and accessible label binding.
 * Spreads remaining input props so integrations (e.g. RHF) keep working.
 */
export function Checkbox({
    checked,
    onChange,
    disabled = false,
    id,
    children,
    ...inputProps
}: CheckboxProps) {
    return (
        <StyledCheckbox>
            <input
                type="checkbox"
                id={id.toString()}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...inputProps}
            />
            <label htmlFor={!disabled ? id.toString() : ""}>{children}</label>
        </StyledCheckbox>
    );
}
