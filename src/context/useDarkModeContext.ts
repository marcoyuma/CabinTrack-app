import { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";

export function useDarkModeContext() {
    const context = useContext(DarkModeContext);

    if (context === null) {
        throw new Error(
            "dark mode context cannot be applied outside child component"
        );
    }

    return context;
}
