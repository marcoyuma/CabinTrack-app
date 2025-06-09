import styled from "styled-components";
import Logo from "../../../CabinTrack app/src/ui/Logo/Logo";
import { MainNav } from "../MainNav/MainNav";

const StyledSidebar = styled.aside`
    background-color: var(--color-grey-0);
    padding: 3.2rem 2.4rem;
    border-right: 1px solid var(--color-grey-100);

    grid-row: 1/-1;
`;
export const Sidebar = () => {
    return (
        <StyledSidebar>
            <Logo />
            <MainNav />
        </StyledSidebar>
    );
};
