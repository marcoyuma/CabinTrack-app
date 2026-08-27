import styled, { css } from "styled-components";
import { media } from "../../styles/breakpoints";

const StyledLogo = styled.div`
    display: flex;
    align-items: center;
`;

const Img = styled.img`
    height: 2.6rem;
    width: auto;
    border-radius: var(--border-radius-lg);

    ${media.tablet(css`
        height: 3rem;
    `)}

    ${media.desktop(css`
        height: 3.6rem;
    `)}
`;

export function Logo() {
    return (
        <StyledLogo>
            <Img src="/seaspace-logo-final.png" alt="Logo" />
        </StyledLogo>
    );
}
