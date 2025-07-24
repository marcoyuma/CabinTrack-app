import styled from "styled-components";
import { Database } from "../../../supabase/types/database.types";
import {
    formatCurrency,
    transformCabinDataTypeToFormValues,
} from "../../../utils/helpers";

import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateCabin } from "../hooks/useCreateCabin";
import { useDeleteCabin } from "../hooks/useDeleteCabin";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";
// import { UpdateCabin } from "../UpdateCabin/UpdateCabin";

export type Cabin = Database["public"]["Tables"]["cabins"]["Row"];

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
    column-gap: 2.4rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

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

export const CabinRow = ({ cabin }: { cabin: Cabin }) => {
    // define hook state for showing edit form
    const [showEditForm, setShowEditForm] = useState(false);
    const {
        id,
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
    } = cabin;

    const { isCreating, createCabin } = useCreateCabin();

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
        <>
            <TableRow>
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
                    <button onClick={handleDuplicate} disabled={isCreating}>
                        <HiSquare2Stack />
                    </button>
                    <button onClick={() => setShowEditForm((show) => !show)}>
                        <HiPencil />
                    </button>
                    <button
                        onClick={() => deleteCabin(cabin)}
                        disabled={isDeleting}
                    >
                        <HiTrash />
                    </button>
                </div>
            </TableRow>
            {/* not yet implemented */}
            {/* <UpdateCabin cabin={cabin} /> */}
            {showEditForm && (
                <CreateCabinForm
                    editedCabinData={transformCabinDataTypeToFormValues(cabin)}
                />
            )}
        </>
    );
};
