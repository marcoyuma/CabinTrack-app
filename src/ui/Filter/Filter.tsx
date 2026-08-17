import { MouseEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import { HiChevronDown } from "react-icons/hi2";
import { useBatchSearchParams } from "../../hooks/useBatchSearchParams";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { media } from "../../styles/breakpoints";

const StyledFilter = styled.div`
    position: relative;
`;

const Trigger = styled.button`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background-color: var(--color-grey-0);

    /* color: var(--color-grey-600); */
    font-size: var(--font-size-body);
    font-weight: 500;
    padding: 0.9rem 1.2rem;
    border-radius: 9999px;
    transition: all 0.3s;

    ${media.tablet(css`
        padding: 0.9rem 1.8rem;
    `)}

    &:hover {
        color: var(--color-grey-800);
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

// Position comes from the trigger's getBoundingClientRect (see handleToggle below), not a
// relative offset — NavList (MainNav.tsx) sets overflow-x: auto, which per the CSS overflow
// spec forces overflow-y to auto too, clipping any absolutely-positioned descendant that
// pokes out below it. Rendered into document.body via createPortal + position: fixed instead,
// same escape hatch already used by Menus.tsx for row-action menus inside scrollable tables.
interface StyledListProps {
    $position: { x: number; y: number } | null;
}
const List = styled.ul<StyledListProps>`
    position: fixed;
    top: ${(props) => props.$position?.y ?? 0}px;
    right: ${(props) => props.$position?.x ?? 0}px;
    min-width: 16rem;
    max-width: calc(100vw - 3.2rem);

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);
    padding: 0.4rem;
    z-index: 20;
`;

interface OptionButtonProps {
    $active: boolean;
}
const OptionButton = styled.button<OptionButtonProps>`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 0.8rem 1.2rem;
    font-size: 1.4rem;
    font-weight: 500;
    border-radius: var(--border-radius-sm);
    color: var(--color-grey-600);
    transition: all 0.2s;

    ${({ $active }) =>
        $active &&
        css`
            color: var(--color-brand-600);
            background-color: var(--color-brand-50);
        `}

    &:hover {
        background-color: var(--color-grey-50);
    }
`;

interface FilterPropsType {
    filterField: string;
    options: { value: string; label: string }[];
    paramToReset?: Record<string, string>;
}
export function Filter({
    filterField,
    options,
    paramToReset,
}: FilterPropsType) {
    // custom hook for get and set value to url
    const [params, setParams] = useBatchSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null,
    );
    const triggerRef = useRef<HTMLButtonElement>(null);
    const ref = useOutsideClick<HTMLUListElement>(() => setIsOpen(false), false);

    const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
        // List now lives outside StyledFilter (portaled to document.body), so the trigger
        // click is "outside" as far as useOutsideClick's ref is concerned — stop it from
        // bubbling to the document listener, or the same click that opens the panel
        // immediately closes it again.
        e.stopPropagation();

        const rect = triggerRef.current?.getBoundingClientRect();
        setPosition({
            x: window.innerWidth - (rect?.right ?? 0),
            y: (rect?.bottom ?? 0) + 8,
        });
        setIsOpen((open) => !open);
    };

    const currentFilter = params.get(filterField) || options.at(0)?.value;
    const currentLabel =
        options.find((option) => option.value === currentFilter)?.label ??
        options.at(0)?.label;

    // handle option select
    const handleSelect = (value: string) => {
        if (!value) return;

        // set the filterField to value, and reset other search params to default value
        if (paramToReset) {
            setParams({ [filterField]: value }, paramToReset);
        }

        // or just update the params
        else {
            setParams({ [filterField]: value });
        }

        setIsOpen(false);
    };

    return (
        <StyledFilter>
            <Trigger ref={triggerRef} onClick={handleToggle}>
                <span>{currentLabel}</span>
                <HiChevronDown />
            </Trigger>
            {isOpen &&
                createPortal(
                    <List $position={position} ref={ref}>
                        {options.map((option) => (
                            <li key={option.value}>
                                <OptionButton
                                    $active={currentFilter === option.value}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    {option.label}
                                </OptionButton>
                            </li>
                        ))}
                    </List>,
                    document.body,
                )}
        </StyledFilter>
    );
}
