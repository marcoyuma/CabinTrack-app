import React from "react";
import styled from "styled-components";

// Styled wrapper around the native option element.
const StyledOption = styled.option`
    max-width: 100%;
`;

// Public props accepted by the Option component.
interface OptionPropsType extends React.OptionHTMLAttributes<HTMLOptionElement> {
    children: React.ReactNode;
}

/**
 * Reusable option element for select inputs.
 *
 * @param {OptionPropsType} props - Component props.
 * @param {React.ReactNode} props.children - Option label content.
 */
export function Option({ children, ...props }: OptionPropsType) {
    return <StyledOption {...props}>{children}</StyledOption>;
}
