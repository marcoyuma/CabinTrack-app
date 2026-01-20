import { JSX, MouseEvent, ReactNode, useState } from "react";
import styled from "styled-components";
import { MenusContext } from "./context/MenusContext";
import { useMenusContext } from "./context/useMenusContext";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

// interface for component props
interface StyledListProps {
    position: PositionType | null;
}
const StyledList = styled.ul<StyledListProps>`
    position: fixed;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    /* 'right' and 'top' receive props value for dynamic style rule */
    right: ${(props) => (props.position ? props.position.x : 0)}px;
    top: ${(props) => (props.position ? props.position.y : 0)}px;
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

// interface for position state type
export interface PositionType {
    x: number;
    y: number;
}
interface Menus {
    children: ReactNode;
}

// parent of the compound component
export const Menus = ({ children }: Menus) => {
    const [openId, setOpenId] = useState("");
    const [position, setPosition] = useState<PositionType | null>(null);

    const close = () => setOpenId("");
    const open = setOpenId;

    return (
        <MenusContext.Provider
            value={{ openId, close, open, position, setPosition }}
        >
            {children}
        </MenusContext.Provider>
    );
};

// childrens of 'Menus' component
// component for detecting click
const Toggle = ({ id }: { id: string }) => {
    const { openId, open, close, setPosition } = useMenusContext();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        // Prevent the click event from bubbling up and accidentally closing the menu
        e.stopPropagation();

        // Calculate the clicked button's position to align the menu below it
        const rect = (e.target as HTMLElement)
            .closest("button")
            ?.getBoundingClientRect();
        setPosition({
            x: window.innerWidth - (rect?.width ?? 0) - (rect?.x ?? 0),
            y: (rect?.y ?? 0) + (rect?.height ?? 0) + 8,
        });

        // conditional logic to open or close the menu
        // if the openId is empty or not equal to the current id, open the menu, otherwise close the menu
        if (openId === "" || openId !== id) {
            open(id);
        } else {
            close();
        }
    };
    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
};

// parent component component for grouping relevan button inside
const List = ({ id, children }: { id: string; children: ReactNode }) => {
    // get useMenusContext object value
    const { openId, position, close } = useMenusContext();

    // assign ref
    const ref = useOutsideClick<HTMLUListElement>(close, false);
    if (openId !== id) return null;
    // it float on top of the ui, use 'createPortal'
    return createPortal(
        <StyledList position={position} ref={ref}>
            {children}
        </StyledList>,
        document.body
    );
};

// button for handle click event located inside Menus.List
const Button = ({
    children,
    icon,
    onClick,
}: {
    children: ReactNode;
    icon: JSX.Element;
    onClick?: () => void;
}) => {
    const { close } = useMenusContext();
    const handleClick = () => {
        onClick?.();
        close();
    };

    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
};

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
