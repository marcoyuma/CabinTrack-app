import { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

// This hook is used to access the modal context.
export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (context === null) {
        throw new Error("cannot use context outside parent element");
    }
    return context;
};
