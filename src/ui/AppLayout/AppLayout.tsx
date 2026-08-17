import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import styled, { css } from "styled-components";
import { media } from "../../styles/breakpoints";

const StyledAppLayout = styled.div`
    height: 100vh;
    background-color: var(--color-grey-100);
`;

const Main = styled.main`
    height: 100%;
    /* make this element scrollable if content overflows */
    overflow: scroll;
`;

// Header has no background of its own, so it needs to sit inside Main's scroll context
// (not in a separate grid row) for content to visibly scroll underneath it rather than
// getting hard-clipped at a row boundary.
const StickyHeader = styled.div`
    position: sticky;
    top: 0;
    z-index: 10;
`;

// Padding/gap match StatsGrid's 1.2rem (see Stats.tsx) — same value used for the header-to-
// content gap, between sections, and on all four edges against the viewport.
const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-section-gap);
    padding: var(--spacing-section-gap) 1.6rem;

    ${media.desktop(css`
        padding: var(--spacing-section-gap) 2rem;
    `)}
`;

export function AppLayout() {
    return (
        <StyledAppLayout>
            <Main>
                <StickyHeader>
                    <Header />
                </StickyHeader>
                <Container>
                    <Outlet />
                </Container>
            </Main>
        </StyledAppLayout>
    );
}
