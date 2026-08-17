import styled, { css } from "styled-components";
import { media } from "../../styles/breakpoints";

type FormType = {
    type?: "modal" | "regular";
};

// This component is a styled form that can be used for both regular forms and modal forms.
// It accepts a 'type' prop to determine its styling.
// If the type is 'regular', it will have padding and a box style.
// If the type is 'modal', it will have a specific width for modal forms.
// The default type is 'regular'.
export const Form = styled.form<FormType>`
    // defining default value in css level by 'regular' if undefined
    ${({ type = "regular" }) =>
        type === "regular" &&
        css`
            padding: var(--spacing-card-padding) 2rem;

            /* Box */
            background-color: var(--color-grey-0);
            border: 1px solid var(--color-grey-100);
            border-radius: var(--border-radius-md);

            ${media.tablet(css`
                padding: 2.4rem 4rem;
            `)}
        `}

    ${({ type }) =>
        type === "modal" &&
        css`
            width: 100%;

            ${media.tablet(css`
                width: 80rem;
            `)}
        `}

    overflow: hidden;
    font-size: 1.4rem;
`;
