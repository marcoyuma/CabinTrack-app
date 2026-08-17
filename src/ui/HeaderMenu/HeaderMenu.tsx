import styled from "styled-components";
import { Link } from "react-router-dom";
import { UserAvatar } from "../../features/authentication/components/UserAvatar";

const StyledHeaderMenu = styled.ul`
    display: flex;
    align-items: center;
    gap: 1.2rem;
`;

const AccountLink = styled(Link)`
    display: flex;
    align-items: center;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    padding: 0.4rem 1.6rem 0.4rem 0.4rem;
    border-radius: 9999px;
    transition: background-color 0.3s;

    &:hover {
        background-color: var(--color-grey-100);
    }
`;

export function HeaderMenu() {
    return (
        <StyledHeaderMenu>
            <li>
                <AccountLink to="/account">
                    <UserAvatar />
                </AccountLink>
            </li>
        </StyledHeaderMenu>
    );
}
