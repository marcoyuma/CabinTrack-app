import styled, { css } from "styled-components";

type HeadingType = { as: "h1" | "h2" | "h3" | "h4" };

export const Heading = styled.h1<HeadingType>`
    ${(props) =>
        props.as === "h1" &&
        css`
            font-size: var(--font-size-heading-lg);
            font-weight: 600;
        `}

    ${(props) =>
        props.as === "h2" &&
        css`
            font-size: var(--font-size-heading);
            font-weight: 600;
        `}
    ${(props) =>
        props.as === "h3" &&
        css`
            font-size: var(--font-size-heading);
            font-weight: 500;
        `}
    ${(props) =>
        props.as === "h4" &&
        css`
            font-size: var(--font-size-heading-lg);
            font-weight: 600;
            text-align: center;
        `}

    line-height:1.4;
`;
