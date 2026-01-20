import { useState } from "react";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";
import { Cabin } from "../../types/cabin.schema";

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
                    editedCabinData={cabin}
                />
            )}
        </div>
    );
};
