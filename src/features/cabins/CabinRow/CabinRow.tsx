import styled from "styled-components";
import {
    formatCurrency,
    transformCabinDataTypeToFormValues,
} from "../../../utils/helpers";

import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "../hooks/useCreateCabin";
import { useDeleteCabin } from "../hooks/useDeleteCabin";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";
import { Modal } from "../../../ui/Modal/Modal";
import { ConfirmDelete } from "../../../ui/ConfirmDelete/ConfirmDelete";
import { Table } from "../../../ui/Table/Table";
import { Menus } from "../../../ui/Menus/Menus";
import { CabinType } from "../../../services/types/cabins.type";

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

export const CabinRow = ({ cabin }: { cabin: CabinType }) => {
    const {
        id,
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
    } = cabin;

    // convert id into string for Menus props compatible
    const cabinId = id.toString();

    const { createCabin } = useCreateCabin();

    // ensure the image is not null before using as a string.
    const finalImage = (image ?? "") as string;

    // handle duplicate click event
    const handleDuplicate = () => {
        createCabin({
            // id, here we couldn't passed the id because it will duplicate the existing id since we're copying this and causing an error
            name: `copy of ${name}`,
            maxCapacity: maxCapacity ?? 0,
            regularPrice: regularPrice ?? 0,
            discount: discount ?? 0,
            description: description ?? "nothing to described",
            image: finalImage,
        });
    };

    // destructuring hook for delete cabin handler
    const { isDeleting, deleteCabin } = useDeleteCabin();

    return (
        <Table.Row>
            <Img src={image ?? ""} />
            <Cabin>{name}</Cabin>
            <p>Fits up to {maxCapacity} guests</p>
            <Price>{formatCurrency(regularPrice)}</Price>
            {discount ? (
                <Discount>{formatCurrency(discount)}</Discount>
            ) : (
                <span>&mdash;</span>
            )}
            <div>
                {/* modal open for edit form */}
                <Modal>
                    <Menus.Menu>
                        <Menus.Toggle id={cabinId} />

                        <Menus.List id={cabinId}>
                            {/* duplicate */}
                            <Menus.Button
                                icon={<HiSquare2Stack />}
                                onClick={handleDuplicate}
                            >
                                duplicate
                            </Menus.Button>

                            {/* modal open for showing delete confirmation */}
                            <Modal.Open opens="confirm-deletion">
                                {/* delete */}
                                {(open) => (
                                    <Menus.Button
                                        icon={<HiTrash />}
                                        onClick={open}
                                    >
                                        delete
                                    </Menus.Button>
                                )}
                            </Modal.Open>

                            {/* edit */}
                            <Modal.Open opens="edit-form">
                                {(open) => (
                                    <Menus.Button
                                        icon={<HiPencil />}
                                        onClick={open}
                                    >
                                        edit
                                    </Menus.Button>
                                )}
                            </Modal.Open>
                        </Menus.List>

                        {/* window modal for edit form */}
                        <Modal.Window name="edit-form">
                            {(close) => (
                                <CreateCabinForm
                                    editedCabinData={transformCabinDataTypeToFormValues(
                                        cabin
                                    )}
                                    onCloseModal={close}
                                />
                            )}
                        </Modal.Window>

                        {/* window modal for delete confirmation */}
                        <Modal.Window name="confirm-deletion">
                            {(close) => (
                                <ConfirmDelete
                                    resourceName={name ?? "resource"}
                                    onConfirm={() => deleteCabin(cabin)}
                                    onCancel={close}
                                    disabled={isDeleting}
                                />
                            )}
                        </Modal.Window>
                    </Menus.Menu>
                </Modal>
            </div>
        </Table.Row>
    );
};
