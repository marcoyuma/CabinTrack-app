import styled from "styled-components";
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineUserGroup,
} from "react-icons/hi2";
import { Menus } from "../../../ui/Menus/Menus";
import { Modal } from "../../../ui/Modal/Modal";
import { ConfirmDelete } from "../../../ui/ConfirmDelete/ConfirmDelete";
import { Stay } from "../types/stay.schema";
import { useDeleteStay } from "../hooks/useDeleteStay";
import { useIsStaff } from "../hooks/useIsStaff";
import { supabaseUrl } from "../../../supabase/supabase";
import { EditStayForm } from "./EditStayForm";
import { CellLabel, Field, TableRowItem } from "./stayTable.styles";

const VillaCell = styled.div`
    display: flex;
    align-items: center;
    gap: 1.6rem;
    min-width: 0;
`;

// Landscape 16:9 crop, matching the reference's wide room thumbnails rather than the square
// avatars the old cabins table used.
const Thumbnail = styled.img`
    width: 11rem;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--border-radius-sm);
    flex-shrink: 0;
    display: block;
`;

const ThumbnailPlaceholder = styled.div`
    width: 11rem;
    aspect-ratio: 16 / 9;
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-100);
    flex-shrink: 0;
`;

const VillaText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
`;

const VillaName = styled.span`
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-700);
`;

const VillaMeta = styled.span`
    font-size: 1.3rem;
    color: var(--color-grey-500);
`;

const Cell = styled.span`
    font-size: 1.4rem;
    color: var(--color-grey-600);
`;

const MutedCell = styled(Cell)`
    color: var(--color-grey-400);
`;

const IconCell = styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.4rem;
    color: var(--color-grey-600);

    & svg {
        width: 1.7rem;
        height: 1.7rem;
        color: var(--color-grey-400);
        flex-shrink: 0;
    }
`;

// Pill badge with a leading icon — the reference's green "Available" chip. Here it carries the
// one readiness fact that actually matters: a villa with zero photos crashes the customer
// site's detail page (see ADMIN-PANEL-CONTEXT2.md), so it must be visible at a glance.
const StatusBadge = styled.span<{ $ready: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    width: fit-content;

    padding: 0.5rem 1.1rem;
    border-radius: 9999px;
    font-size: 1.2rem;
    font-weight: 600;

    color: ${({ $ready }) =>
        $ready ? "var(--color-green-700)" : "var(--color-red-700)"};
    background-color: ${({ $ready }) =>
        $ready ? "var(--color-green-100)" : "var(--color-red-100)"};

    & svg {
        width: 1.5rem;
        height: 1.5rem;
    }
`;

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4rem;
`;

const IconButton = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    transition: all 0.2s;

    & svg {
        width: 1.8rem;
        height: 1.8rem;
        color: var(--color-grey-500);
    }

    &:hover {
        background-color: var(--color-grey-100);
    }
`;

const DisabledMenuItem = styled.li`
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    color: var(--color-grey-400);
    cursor: not-allowed;

    & svg {
        width: 1.6rem;
        height: 1.6rem;
    }
`;

interface StayRowProps {
    stay: Stay;
    coverPath?: string;
    imageCount: number;
    featuredCount: number;
}

export function StayRow({ stay, coverPath, imageCount, featuredCount }: StayRowProps) {
    const { removeStay, isDeleting } = useDeleteStay();
    const { role } = useIsStaff();

    const canDeleteVilla = role === "manager";
    const isReady = imageCount > 0;

    return (
        <TableRowItem>
            <VillaCell>
                {coverPath ? (
                    <Thumbnail
                        src={`${supabaseUrl}/storage/v1/object/public/stays/${coverPath}`}
                        alt=""
                    />
                ) : (
                    <ThumbnailPlaceholder />
                )}
                <VillaText>
                    <VillaName>{stay.name}</VillaName>
                    <VillaMeta>{stay.location}</VillaMeta>
                </VillaText>
            </VillaCell>

            <Field>
                <CellLabel>Price</CellLabel>
                <Cell>Rp{stay.price_per_night.toLocaleString("id-ID")} / night</Cell>
            </Field>

            <Field>
                <CellLabel>Discount</CellLabel>
                {stay.discount > 0 ? (
                    <Cell>-Rp{stay.discount.toLocaleString("id-ID")}</Cell>
                ) : (
                    <MutedCell>No discount</MutedCell>
                )}
            </Field>

            <Field>
                <CellLabel>Specs</CellLabel>
                <IconCell>
                    <HiOutlineUserGroup />
                    <span>
                        {stay.capacity} guests · {stay.beds} beds · {stay.area} m²
                    </span>
                </IconCell>
            </Field>

            <Field>
                <CellLabel>Photos</CellLabel>
                <Cell>
                    {imageCount} {imageCount === 1 ? "photo" : "photos"}
                </Cell>
            </Field>

            <Field>
                <CellLabel>Status</CellLabel>
                <StatusBadge $ready={isReady}>
                    {isReady ? <HiOutlineCheckCircle /> : <HiOutlineExclamationCircle />}
                    {isReady ? "Ready" : "No photos"}
                </StatusBadge>
            </Field>

            {/* Modal is provided per-row (not per-table) so the "edit-stay"/"delete-stay" window
                names don't collide across rows — each row gets its own open/close state. */}
            <Modal>
                <Actions>
                    <Modal.Open opens="edit-stay">
                        {(open: () => void) => (
                            <IconButton type="button" title="Edit villa" onClick={open}>
                                <HiOutlinePencil />
                            </IconButton>
                        )}
                    </Modal.Open>

                    <Menus.Toggle id={String(stay.id)} />
                </Actions>

                <Menus.List id={String(stay.id)}>
                    {canDeleteVilla ? (
                        // Function form is required: Modal.Open only wires its open handler when
                        // children is a render function — an element child is passed through
                        // untouched and the button would silently do nothing.
                        <Modal.Open opens="delete-stay">
                            {(open: () => void) => (
                                <Menus.Button icon={<HiOutlineTrash />} onClick={open}>
                                    Delete
                                </Menus.Button>
                            )}
                        </Modal.Open>
                    ) : (
                        <DisabledMenuItem title="Only a manager can delete a villa">
                            <HiOutlineTrash />
                            <span>Delete</span>
                        </DisabledMenuItem>
                    )}
                </Menus.List>

                <Modal.Window name="edit-stay">
                    {(close: () => void) => (
                        <EditStayForm
                            stay={stay}
                            featuredCount={featuredCount}
                            onClose={close}
                        />
                    )}
                </Modal.Window>

                {canDeleteVilla && (
                    <Modal.Window name="delete-stay">
                        {(close: () => void) => (
                            <ConfirmDelete
                                resourceName="villa"
                                disabled={isDeleting}
                                onConfirm={() => {
                                    removeStay(stay.id);
                                    close();
                                }}
                                onCancel={close}
                            />
                        )}
                    </Modal.Window>
                )}
            </Modal>
        </TableRowItem>
    );
}
