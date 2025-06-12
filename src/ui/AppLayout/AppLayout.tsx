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
`;

export const AppLayout = () => {
    return (
        <StyledAppLayout>
            <Header />
            <Sidebar />
            <Main>
                <Outlet />
            </Main>
        </StyledAppLayout>
    );
};
