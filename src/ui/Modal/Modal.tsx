import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ModalContext } from "./context/ModalContext";
import { useModalContext } from "./hooks/useModalContext";

// This component is a modal that can be used to display content in a popup window.
const StyledModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 3.2rem 4rem;
    transition: all 0.5s;
`;

// This component is an overlay that covers the entire screen when the modal is open, providing a backdrop effect.
// It prevents interaction with the rest of the page while the modal is open.
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--backdrop-color);
    backdrop-filter: blur(4px);
    z-index: 1000;
    transition: all 0.5s;
`;

// This component is a styled button that is used to close the modal.
// It is positioned at the top right corner of the modal and has a hover effect.
const Button = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;
    position: absolute;
    top: 1.2rem;
    right: 1.9rem;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        /* Sometimes we need both */
        /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
        color: var(--color-grey-500);
    }
`;

// interface for Modal props
interface ModalProps {
    children: ReactNode;
}

// This is the main Modal component that provides the context for managing the modal's open state.
// It uses the 'ModalContext' to provide the 'open' and 'close' functions, as well as the current open name.
// The 'children' of this component will have access to the modal context.
export const Modal = ({ children }: ModalProps) => {
    const [openName, setOpenName] = useState("");
    console.log(openName);

    // This function sets the open name to the provided name, effectively opening the modal.
    // The 'close' function resets the open name to an empty string, closing the modal.
    const close = () => setOpenName("");
    // The 'open' function is used to set the modal to a specific name, allowing
    const open = (name: string) => setOpenName(name);
    return (
        <ModalContext.Provider value={{ openName, open, close }}>
            {children}
        </ModalContext.Provider>
    );
};

// interface for Open props
interface OpenProps {
    opens: string;

    /**
     *  This component is used to open the modal.
     * @param open function to open the modal
     * @description This function is called when the modal is opened.
     * It receives a function that can be called to open the modal.
     * This allows the parent component to control when the modal opens.
     * @returns - {ReactNode} - A function that returns a ReactNode.
     * @example
     * <Modal.Open opens="cabin-form">
     *   {(open) => <Button onClick={open}>Open Modal</Button>}
     * </Modal.Open>
    
     */
    children: ((open: () => void) => ReactNode) | ReactNode;
}

/**
 *  This component is used to open the modal.
 * @param opens - The name of the modal to open.
 * @param children - A function that receives an 'open' function to open the modal.
 *
 * @description This function is called when the modal is opened.
 * It receives a function that can be called to open the modal.
 * This allows the parent component to control when the modal opens.
 * It is used in conjunction with the `Modal.Window` component to display the modal content.
 *
 * @returns {ReactNode} - A function that returns a ReactNode.
 * @example
 * <Modal.Open opens="cabin-form">
 *   {(open) => <Button onClick={open}>Open Modal</Button>}
 * </Modal.Open>
 */
const Open = ({ opens, children }: OpenProps) => {
    const { open } = useModalContext();

    const handleClick = () => open(opens);
    return <>{children(handleClick)}</>;
};

// This is the main Modal component that accepts 'children' and an 'onClose' function as props.
interface WindowProps {
    /**
     *
     * @param close  function to close the modal
     *
     * @description This function is called when the modal is closed.
     * It receives a function that can be called to close the modal.
     * This allows the parent component to control when the modal closes.
     *
     * @returns {ReactNode} - A function that returns a ReactNode.
     */
    children: ReactNode | ((close: () => void) => ReactNode);
    name: string;
}

// This component renders the modal with an overlay and a close button.
export const Window = ({ children, name }: WindowProps) => {
    const { openName, close } = useModalContext();

    // This function is called when the modal is closed.
    // It calls the 'close' function from the modal context to reset the open name.
    // It also provides a way to close the modal from within the children function.
    // This allows the modal to be closed by clicking outside of it or by clicking the close button.
    const handleClose = () => close();

    // This hook is used to handle outside click events.
    // It provides a ref that can be attached to the modal element.
    // When a click occurs outside of the modal, it calls the 'handleClose' function to close the modal.
    // The 'listenCapturing' parameter is set to true to ensure that the click event
    const { ref } = useOutsideClick(handleClose);

    // If the current open name does not match the provided name, return null to avoid rendering the modal.
    if (openName !== name) return null;

    // Render the modal using createPortal to render it in the body of the document.
    // This allows the modal to be displayed on top of other content without being affected by the
    // parent component's styling or layout.
    return createPortal(
        <Overlay>
            <StyledModal ref={ref}>
                <Button onClick={handleClose}>
                    <HiXMark />
                </Button>

                {/* Render the children of the modal, passing the handleClose function if children is a function */}
                {/* If children is a function, call it with handleClose, otherwise just render the children directly */}
                <div>
                    {typeof children === "function"
                        ? children(handleClose)
                        : children}
                </div>
            </StyledModal>
        </Overlay>,
        document.body
    );
};

// Export the Modal components for use in other parts of the application.
Modal.Open = Open;
Modal.Window = Window;
