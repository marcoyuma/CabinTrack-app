// This is the context that will be used to manage the modal's open state.

import { createContext } from "react";

// It provides functions to 'open' and 'close' the modal, as well as the 'name' of the currently
export const ModalContext = createContext<{
    openName: string;
    close: () => void;
    open: (name: string) => void;
} | null>(null);
