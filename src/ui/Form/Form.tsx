import styled, { css } from "styled-components";

type FormType = {
    type?: "modal" | "regular";
};

// This component is a styled form that can be used for both regular forms and modal forms.
// It accepts a 'type' prop to determine its styling.
// If the type is 'regular', it will have padding and a box style.
// If the type is 'modal', it will have a specific width for modal forms.
// The default type is 'regular'.
const Form = styled.form<FormType>`
    ${(props) =>
        props.type === "regular" &&
        css`
            padding: 2.4rem 4rem;

            /* Box */
            background-color: var(--color-grey-0);
            border: 1px solid var(--color-grey-100);
            border-radius: var(--border-radius-md);
        `}

    ${(props) =>
        props.type === "modal" &&
        css`
            width: 80rem;
        `}

    /* way to define default props logic  */
    ${(props) => props.type || "regular"}
    
  overflow: hidden;
    font-size: 1.4rem;
`;

export default Form;
