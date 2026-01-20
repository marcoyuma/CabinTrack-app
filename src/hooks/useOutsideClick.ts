import { useEffect, useRef } from "react";

/**
 * Custom hook to handle outside click events.
 *
 * @param onOutsideClick - Function to call when an outside click is detected.
 * @param listenCapturing - Whether to listen for the event during the capture phase (default is true).
 *
 * @description This hook listens for click events on the document and checks if the clicked element is outside of the specified ref.
 * If it is, it calls the `onOutsideClick` function.
 * This is useful for closing modals or dropdowns when the user clicks outside of them.
 *
 * @returns - An object containing a `ref` that can be attached to the element to detect outside clicks.
 */
export const useOutsideClick = <T extends HTMLElement>(
    onOutsideClick: () => void,
    listenCapturing: boolean = true
) => {
    // This ref is used to attach the click event listener to the document in target element.
    // It will be used to check if the clicked element is outside of the modal.
    const ref = useRef<T>(null);

    // This effect listens for clicks on the document.
    // It checks if the clicked element is outside the modal.
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            // validate if the 'ref' is set and if the clicked element is not inside the 'ref' with 'e.target'
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onOutsideClick();
            }
        };

        // Add an event listener to the document to listen for clicks.
        // This allows us to detect clicks outside the modal and close it accordingly.
        // The event listener is added to the document to capture clicks anywhere on the page.
        // The event listener is set to use the capture phase (true) so that it can catch clicks before they reach the modal.
        // true = listen during the capture phase (before bubbling), ensures outside clicks are detected
        document.addEventListener("click", handleClick, listenCapturing);

        // The event listener is removed when the component unmounts to prevent memory leaks.
        return () =>
            document.removeEventListener("click", handleClick, listenCapturing);
    }, [ref, onOutsideClick, listenCapturing]);

    // Return the ref that can be attached to the modal element.
    // This ref will be used to check if the clicked element is outside of the modal.
    return ref;
};
