import { ReactElement, ReactNode } from "react";
import styled from "styled-components";

const StyledDataItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 0.8rem 0;
`;

const Label = styled.span`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 500;

    & svg {
        width: 2rem;
        height: 2rem;
        color: var(--color-brand-600);
    }
`;

/**
 * One labelled row of booking detail: brand-coloured icon, bold label, value on the right.
 *
 * `icon` is deliberately `ReactElement` rather than `ReactNode` — `Label` styles its child
 * through an `& svg` selector, so it expects a single icon element, not text or a list.
 *
 * @example
 * <DataItem icon={<HiOutlineCheckCircle />} label="Breakfast included?">
 *     {hasBreakfast ? "Yes" : "No"}
 * </DataItem>
 */
export function DataItem({
    icon,
    label,
    children,
}: {
    icon: ReactElement;
    label: string;
    children: ReactNode;
}) {
    return (
        <StyledDataItem>
            <Label>
                {icon}
                <span>{label}</span>
            </Label>
            {children}
        </StyledDataItem>
    );
}
