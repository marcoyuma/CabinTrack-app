import styled, { css } from "styled-components";
import { HeaderMenu } from "../HeaderMenu/HeaderMenu";
import { Logo } from "../Logo/Logo";
import { MainNav } from "../MainNav/MainNav";
import { media } from "../../styles/breakpoints";

// Horizontal padding matches Container's (AppLayout.tsx) so the header edge-aligns with the
// content below it. flex-wrap is a safety net for narrow viewports — MainNav's icon-only
// mobile treatment should normally keep everything on one row, but this avoids clipping if
// it doesn't.
const StyledHeader = styled.header`
    padding: 1.2rem 1.6rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.2rem;
    align-items: center;
    justify-content: space-between;

    ${media.desktop(css`
        padding: 1.6rem 2rem 0;
        gap: 2.4rem;
    `)}
`;
export function Header() {
    return (
        <StyledHeader>
            <Logo />
            <MainNav />
            <HeaderMenu />
        </StyledHeader>
    );
}
