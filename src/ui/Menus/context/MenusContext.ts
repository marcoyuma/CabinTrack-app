import { createContext, Dispatch, SetStateAction } from "react";
import { PositionType } from "../Menus";

// context for Menus
export const MenusContext = createContext<{
    openId: string;
    close: () => void;
    open: Dispatch<SetStateAction<string>>;
    position: PositionType | null;
    setPosition: Dispatch<SetStateAction<null | PositionType>>;
} | null>(null);
