import styled, { css } from "styled-components";
import { Heading } from "../Heading/Heading";
import { Button } from "../Button/Button";
import { media } from "../../styles/breakpoints";

const StyledConfirmDelete = styled.div`
    width: min(40rem, 100%);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    ${media.tablet(css`
        width: 40rem;
    `)}

    & p {
        color: var(--color-grey-500);
        margin-bottom: 1.2rem;
    }

    & div {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

interface ConfirmDeleteProps {
    resourceName: string;
    disabled: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
export function ConfirmDelete({
    resourceName,
    disabled,
    onConfirm,
    onCancel,
}: ConfirmDeleteProps) {
    const handleDelete = () => onConfirm();
    const handleCancel = () => onCancel();
    return (
        <StyledConfirmDelete>
            <Heading as="h3">Delete {resourceName}</Heading>
            <p>
                Are you sure you want to delete this {resourceName} permanently?
                This action cannot be undone.
            </p>

            <div>
                <Button
                    variation="secondary"
                    disabled={disabled}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    variation="danger"
                    disabled={disabled}
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </div>
        </StyledConfirmDelete>
    );
}
