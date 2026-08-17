import { ReactNode } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import styled, { css, keyframes } from "styled-components";
import { media } from "../../../styles/breakpoints";

/**
 * Shared layout primitives for the two stays forms (CreateStayForm, EditStayForm).
 *
 * Both render as modal content, which is why none of this reuses the app's older
 * `Form`/`FormRow` UI kit: FormRow is a wide label-beside-input grid (24rem label column) that
 * would make a 13-field modal unreasonably tall. Label-above-input in a two-column grid keeps
 * both forms inside one viewport-height scroll container instead.
 */

/**
 * Modal-content form shell. Scrolls internally so the modal itself never exceeds the viewport.
 *
 * `width: 100%` + `max-width: $width` (not a `vw`-based cap) is deliberate: `Modal.tsx`'s
 * `StyledModal` already clamps itself to `calc(100vw - 2.4rem)` on mobile and shrink-wraps its
 * content otherwise. A second, independent `vw` cap here (the old `max-width: 92vw`) doesn't
 * account for the modal's own padding, so on narrow phones the form could compute wider than
 * the space actually left inside the modal card and overflow it. Filling 100% of whatever the
 * modal leaves available, capped only by the form's own preferred width, avoids that conflict.
 */
export const FormShell = styled.form<{ $width?: string }>`
    width: 100%;
    max-width: ${({ $width }) => $width ?? "64rem"};
    max-height: 85vh;
    overflow-y: auto;
    padding-right: 0.4rem;

    ${media.tablet(css`
        max-height: 78vh;
    `)}
`;

export const Title = styled.h3`
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-grey-800);
`;

export const Subtitle = styled.p`
    font-size: 1.3rem;
    color: var(--color-grey-500);
    margin-top: 0.4rem;
    margin-bottom: 2.4rem;
`;

// Single column below tablet — a 2-col grid inside a ~92vw-capped modal leaves each field too
// narrow to type into on a phone. Becomes the original 2-column layout at tablet+.
export const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.6rem;

    ${media.tablet(css`
        grid-template-columns: 1fr 1fr;
    `)}
`;

/**
 * `$full` spans the field across both grid columns — for description, location, pickers.
 * `position: relative` is load-bearing: it's the anchor `ErrorText`'s popup bubble positions
 * itself against (`position: absolute` below), same anchoring pattern as `StayLocationPicker`'s
 * `Results` dropdown — never a portal, since the modal here closes itself on any click outside
 * its own ref, and a portalled bubble would count as "outside" and dismiss the whole form.
 * `$full`'s "span both columns" is a no-op at mobile (only one column exists), which is exactly
 * what's wanted there.
 */
export const Field = styled.div<{ $full?: boolean }>`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    grid-column: ${({ $full }) => ($full ? "1 / -1" : "auto")};
`;

export const Label = styled.label`
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--color-grey-600);
`;

/** `$hasError` swaps the border/focus ring to red — driven by RHF's `formState.errors`. */
export const TextInput = styled.input<{ $hasError?: boolean }>`
    border: 1px solid
        ${({ $hasError }) => ($hasError ? "var(--color-red-700)" : "var(--color-grey-200)")};
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.9rem 1.2rem;
    font-size: 1.4rem;
    width: 100%;

    &:focus {
        outline: 2px solid
            ${({ $hasError }) => ($hasError ? "var(--color-red-700)" : "var(--color-brand-600)")};
        outline-offset: -1px;
    }

    &:disabled {
        background-color: var(--color-grey-50);
        color: var(--color-grey-500);
    }
`;

export const TextArea = styled.textarea<{ $hasError?: boolean }>`
    border: 1px solid
        ${({ $hasError }) => ($hasError ? "var(--color-red-700)" : "var(--color-grey-200)")};
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.9rem 1.2rem;
    font-size: 1.4rem;
    width: 100%;
    min-height: 10rem;
    resize: vertical;

    &:focus {
        outline: 2px solid
            ${({ $hasError }) => ($hasError ? "var(--color-red-700)" : "var(--color-brand-600)")};
        outline-offset: -1px;
    }
`;

export const Hint = styled.span`
    font-size: 1.2rem;
    color: var(--color-grey-500);
`;

const popIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-3px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

/**
 * Same panel language as `StayLocationPicker`'s `Results` dropdown (white background,
 * `--shadow-md`, `--border-radius-sm`) so it reads as "this app's floating panel", not a
 * foreign tooltip widget — just with a `--color-red-100` accent border and red icon/text to
 * read as an error rather than a menu. The two stacked triangles are the standard
 * bordered-tooltip-arrow trick: the bottom one (`--color-grey-0`, half a pixel smaller and
 * offset by the border width) sits on top of the top one (`--color-red-100`) to fake a 1px
 * border around the arrow that matches the bubble's own border.
 */
const ErrorBubble = styled.span`
    position: absolute;
    top: calc(100% + 0.8rem);
    left: 0;
    z-index: 5;
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    width: max-content;
    max-width: min(30rem, 100%);
    padding: 0.7rem 1rem;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-red-100);
    border-radius: var(--border-radius-sm);
    box-shadow: var(--shadow-md);
    font-size: 1.2rem;
    line-height: 1.4;
    color: var(--color-red-800);
    animation: ${popIn} 0.15s ease-out;

    &::before,
    &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 1.4rem;
        border: 0.5rem solid transparent;
    }

    &::before {
        border-bottom-color: var(--color-red-100);
    }

    &::after {
        margin-left: 1px;
        border-width: 0.4rem;
        border-bottom-color: var(--color-grey-0);
    }

    & svg {
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
        color: var(--color-red-700);
    }
`;

/**
 * Field-level validation message, styled as a small popup anchored below the input rather than
 * plain text in flow — an icon plus a bordered/shadowed bubble reads as "stop and fix this" at
 * a glance instead of blending in with `Hint`. Needs a `position: relative` ancestor to anchor
 * against; `Field` (`StayFormLayout.tsx`) provides that for every call site in these two forms.
 */
export function ErrorText({ children }: { children: ReactNode }) {
    return (
        <ErrorBubble role="alert">
            <HiOutlineExclamationCircle />
            <span>{children}</span>
        </ErrorBubble>
    );
}

export const SectionLabel = styled.h4`
    grid-column: 1 / -1;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-grey-500);
    margin-top: 0.8rem;
`;

export const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
    margin-top: 2.8rem;
`;
