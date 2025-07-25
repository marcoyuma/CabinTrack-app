import { useContext } from "react";
import { TableContext } from "./TableContext";

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (context === null) {
        throw new Error(
            "table context cannot be applied ouside child component"
        );
    }
    return context;
};
