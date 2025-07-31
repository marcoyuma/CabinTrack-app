import { useContext } from "react";
import { MenusContext } from "./MenusContext";

export const useMenusContext = () => {
    const context = useContext(MenusContext);
    if (context === null) {
        throw new Error(
            "Menus Context could not be used outside of its child component"
        );
    }
    return context;
};
