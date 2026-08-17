import styled from "styled-components";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { useUser } from "../hooks/useUser";

import defaultUser from "/default-user.jpg";

const StyledUserAvatar = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
    font-weight: 500;
    font-size: 1.4rem;
    color: var(--color-grey-700);
`;

const Avatar = styled.img`
    display: block;
    width: 3.6rem;
    aspect-ratio: 1;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    outline: 2px solid var(--color-grey-100);
`;

const Chevron = styled(HiOutlineChevronDown)`
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
`;

interface UserMetadata {
    fullName?: string;
    avatar?: string;
}

export function UserAvatar() {
    const { user } = useUser();

    if (!user) return null;

    const userMetadata: UserMetadata = user.user_metadata;
    const { fullName, avatar } = userMetadata;

    return (
        <StyledUserAvatar>
            <Avatar src={avatar || defaultUser} alt={`avatar of ${fullName}`} />
            <span>{fullName}</span>
            <Chevron />
        </StyledUserAvatar>
    );
}
