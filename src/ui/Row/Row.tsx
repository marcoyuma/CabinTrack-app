import styled, { css } from "styled-components";

// define type for the div props
type RowType = {
    type?: "vertical" | "horizontal";
};
// define styled component with custom div props type
export const Row = styled.div<RowType>`
    display: flex;
    ${(props) => {
        switch (props.type) {
            case "horizontal":
                return css`
                    justify-content: space-between;
                    align-items: center;
                `;
            /* we can set some case to be default case */
            case "vertical":
            default:
                return css`
                    flex-direction: column;
                    gap: 1.6rem;
                `;
        }
    }}/* ${(props) =>
        props.type === "horizontal" &&
        css`
            justify-content: space-between;
            align-items: center;
        `}
    ${(props) =>
        props.type === "vertical" &&
        css`
            flex-direction: column;
            gap: 1.6rem;
        `} */
`;

/* THIS  */
/* Row without type will be default as 'vertical' */
Row.defaultProps = {
    type: "vertical",
};
