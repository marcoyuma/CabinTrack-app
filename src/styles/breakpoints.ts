import { css, type RuleSet } from "styled-components";

const sizes = {
    tablet: 768,
    desktop: 1024,
} as const;

export const media = {
    tablet: (styles: RuleSet<object>) => css`
        @media (min-width: ${sizes.tablet}px) {
            ${styles}
        }
    `,
    desktop: (styles: RuleSet<object>) => css`
        @media (min-width: ${sizes.desktop}px) {
            ${styles}
        }
    `,
};
