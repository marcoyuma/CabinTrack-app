import { ReactNode } from "react";
import styled from "styled-components";

const StyledFormRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0.8rem 0;
`;

const Label = styled.label`
    font-size: var(--font-size-body);
    font-weight: 500;
    color: var(--color-grey-700);
`;

const Error = styled.span`
    font-size: var(--font-size-small);
    color: var(--color-red-700);
`;

export function FormRowVertical({
    htmlFor,
    label,
    error,
    children,
}: {
    htmlFor?: string;
    label?: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <StyledFormRow>
            {label && <Label htmlFor={htmlFor}>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}
