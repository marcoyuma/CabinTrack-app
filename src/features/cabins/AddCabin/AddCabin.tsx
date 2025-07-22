import { useState } from "react";
import { Button } from "../../../ui/Button/Button";
import { Row } from "../../../ui/Row/Row";
import { Modal } from "../../../ui/Modal/Modal";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";

// This component is used to add a new cabin by opening a modal with the CreateCabinForm.
// It manages the state of whether the modal is open or closed.
// When the button is clicked, it toggles the modal's visibility.
// When the modal is closed, it will not be visible anymore.
// The CreateCabinForm is rendered inside the modal, allowing users to fill out the form
// to create a new cabin.
export const AddCabin = () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    return (
        <Row>
            <Button
                onClick={() => setIsOpenModal((isOpenModal) => !isOpenModal)}
            >
                Add new cabin
            </Button>
            {isOpenModal && (
                <Modal onClose={() => setIsOpenModal(false)}>
                    <CreateCabinForm
                        onCloseModal={() => setIsOpenModal(false)}
                    />
                </Modal>
            )}
        </Row>
    );
};
