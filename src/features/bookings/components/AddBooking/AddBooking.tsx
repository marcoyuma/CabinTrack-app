import { Button } from "../../../../ui/Button/Button";
import { Modal } from "../../../../ui/Modal/Modal";
import { CreateBookingForm } from "../CreateBookingForm/CreateBookingForm";

export const AddBooking = () => {
    return (
        <Modal>
            {/* This is the button that opens the modal to add a new cabin */}
            {/* The Modal.Open component is used to open the modal when the button is clicked */}
            {/* It receives a function that can be called to open the modal */}
            <Modal.Open opens="booking-form">
                {(open) => <Button onClick={open}>Add new booking</Button>}
            </Modal.Open>

            {/* The CreateCabinForm component is rendered inside the modal */}
            <Modal.Window name="booking-form">
                {/* The onCloseModal prop is passed to the CreateCabinForm to close the modal
                when the form is submitted or cancelled */}
                {(close) => <CreateBookingForm onCloseModal={close} />}
            </Modal.Window>
        </Modal>
    );
};
