import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { media } from "../../styles/breakpoints";

// Fixed 24rem label column has no room on mobile — stacks label-above-input below tablet,
// becomes the original 3-col grid (label / input / spacer) once there's width for it. $actions
// rows (button groups) stay a flex row at every size, that layout was never the problem.
const StyledFormRow = styled.div<{ $actions?: boolean }>`
    display: ${({ $actions }) => ($actions ? "flex" : "grid")};
    justify-content: ${({ $actions }) => $actions && "flex-end"};
    align-items: ${({ $actions }) => ($actions ? "center" : "stretch")};
    grid-template-columns: ${({ $actions }) => !$actions && "1fr"};
    gap: ${({ $actions }) => ($actions ? "1.2rem" : "0.8rem")};

    ${({ $actions }) =>
        !$actions &&
        media.tablet(css`
            align-items: center;
            grid-template-columns: 24rem 1fr 1.2fr;
            gap: 2.4rem;
        `)}

    padding: 1.2rem 0;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    /* &:has(button) {
        display: flex;
        justify-content: flex-start;
        gap: 1.2rem;
    } */
`;

const Label = styled.label`
    font-weight: 500;
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);
`;

export function FormRow({
    htmlFor,
    label,
    error,
    children,
    actions,
}: {
    htmlFor?: string;
    label?: string;
    error?: string | undefined;
    children: ReactNode;
    actions?: boolean;
}) {
    return (
        <StyledFormRow $actions={actions}>
            {label && <Label htmlFor={htmlFor}>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}
