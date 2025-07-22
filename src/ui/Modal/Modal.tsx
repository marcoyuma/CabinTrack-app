import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";

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

// This is the main Modal component that accepts children and an onClose function as props.
interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

// This component renders the modal with an overlay and a close button.
export const Modal = ({ children, onClose }: ModalProps) => {
    // createPortal is used to render the modal outside of the normal DOM hierarchy,
    // allowing it to overlay other content without being affected by CSS styles of the parent components.
    // This is useful for modals, as they often need to be displayed on top of other content.
    // The modal is rendered inside the document body to ensure it covers the entire viewport.
    // The onClose function is called when the close button is clicked, allowing the parent component
    // to handle the closing of the modal.
    return createPortal(
        <Overlay>
            <StyledModal>
                <Button onClick={onClose}>
                    <HiXMark />
                </Button>
                <div>{children}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
};
