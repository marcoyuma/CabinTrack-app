import { useState } from "react";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";
import { transformCabinDataTypeToFormValues } from "../../../utils/helpers";
import { Cabin } from "../CabinRow/CabinRow";

interface UpdateCabinProps {
    cabin: Cabin;
}
export const UpdateCabin = ({ cabin }: UpdateCabinProps) => {
    const [showEditForm, setShowEditForm] = useState(false);

    return (
        <div>
            {showEditForm && (
                <CreateCabinForm
                    onCloseModal={() => setShowEditForm(false)}
                    editedCabinData={transformCabinDataTypeToFormValues(cabin)}
                />
            )}
        </div>
    );
};
