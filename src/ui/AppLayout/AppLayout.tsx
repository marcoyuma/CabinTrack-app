import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import styled from "styled-components";
import { Sidebar } from "../Sidebar/Sidebar";

const StyledAppLayout = styled.div`
    display: grid;
    grid-template-columns: 26rem 1fr;
    height: 100vh;
    grid-template-rows: auto 1fr;
`;

const Main = styled.main`
    background-color: var(--color-grey-50);
    padding: 4rem 4.8rem 6.4rem;
    /* make this element scrollable if content overflows */
    overflow: scroll;
`;

const Container = styled.div`
    max-width: 120rem;
    margin: 0, auto;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
`;

export const AppLayout = () => {
    return (
        <StyledAppLayout>
            <Header />
            <Sidebar />
            <Main>
                <Container>
                    <Outlet />
                </Container>
            </Main>
        </StyledAppLayout>
    );
};
