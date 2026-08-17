import styled, { css } from "styled-components";
import { media } from "../../styles/breakpoints";

const StyledLogo = styled.div`
    display: flex;
    align-items: center;
`;

const Img = styled.img`
    height: 3.2rem;
    width: auto;

    ${media.tablet(css`
        height: 3.6rem;
    `)}

    ${media.desktop(css`
        height: 4rem;
    `)}
`;

export function Logo() {
    return (
        <StyledLogo>
            <Img src="/cabinTrack-logo.png" alt="Logo" />
        </StyledLogo>
    );
}
