import { Button } from "../../../../ui/Button/Button";
import { Modal } from "../../../../ui/Modal/Modal";
import { CreateCabinForm } from "../CreateCabinForm/CreateCabinForm";

export const AddCabin = () => {
    return (
        <Modal>
            {/* This is the button that opens the modal to add a new cabin */}
            {/* The Modal.Open component is used to open the modal when the button is clicked */}
            {/* It receives a function that can be called to open the modal */}
            <Modal.Open opens="cabin-form">
                {(open) => <Button onClick={open}>Add new cabin</Button>}
            </Modal.Open>

            {/* The CreateCabinForm component is rendered inside the modal */}
            <Modal.Window name="cabin-form">
                {/* The onCloseModal prop is passed to the CreateCabinForm to close the modal
                when the form is submitted or cancelled */}
                {(close) => <CreateCabinForm onCloseModal={close} />}
            </Modal.Window>
        </Modal>
    );
};
