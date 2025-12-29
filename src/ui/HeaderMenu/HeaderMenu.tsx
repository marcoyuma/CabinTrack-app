import styled from "styled-components";
import { Logout } from "../../features/authentication/components/Logout";
import { ButtonIcon } from "../ButtonIcon/ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../../features/authentication/components/UserAvatar";
import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle";

const StyledHeaderMenu = styled.ul`
    display: flex;
    gap: 0.4 rem;
`;

export const HeaderMenu = () => {
    const navigate = useNavigate();

    return (
        <StyledHeaderMenu>
            <UserAvatar />
            <li>
                <ButtonIcon onClick={() => navigate("/account")}>
                    <HiOutlineUser />
                </ButtonIcon>
            </li>
            <li>
                <DarkModeToggle />
            </li>
            <li>
                <Logout />
            </li>
        </StyledHeaderMenu>
    );
};
