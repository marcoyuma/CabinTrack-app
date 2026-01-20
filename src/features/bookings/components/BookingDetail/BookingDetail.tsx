import styled from "styled-components";
import { useMoveBack } from "../../../../hooks/useMoveBack";
import { Row } from "../../../../ui/Row/Row";
import { Heading } from "../../../../ui/Heading/Heading";
import { Tag } from "../../../../ui/Tag/Tag";
import { ButtonText } from "../../../../ui/ButtonText/ButtonText";
import { ButtonGroup } from "../../../../ui/ButtonGroup/ButtonGroup";
import { Button } from "../../../../ui/Button/Button";
import { useBooking } from "../../hooks/useBooking";
import { Spinner } from "../../../../ui/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../../check-in-out/hooks/useCheckout";
import { useDeleteBooking } from "../../hooks/useDeleteBooking";
import { Modal } from "../../../../ui/Modal/Modal";
import { ConfirmDelete } from "../../../../ui/ConfirmDelete/ConfirmDelete";
import { BookingDataBox } from "../BookingDataBox/BookingDataBox";
import { Empty } from "../../../../ui/Empty/Empty";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

/**
 * Displays detailed booking information and provides actions to check in, check out,
 * delete the booking, or navigate back, with proper loading and empty states handling
 */
export const BookingDetail = () => {
    // hook for navigate programmatically
    const navigate = useNavigate();
    const { checkout, isCheckingOut } = useCheckout();
    const { deleteBooking, isBookingDeleting } = useDeleteBooking();

    // custom hook to fetch booking data and its properties
    const { isBookingLoading, booking } = useBooking();

    const moveBack = useMoveBack();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };
    console.log(booking);

    if (isBookingLoading) return <Spinner />;
    if (!booking) return <Empty resourceName="booking" />;

    // destructuring 'status' for 'Tag' component 'type' property and 'id' for displaying booking id
    const { status, id: bookingId } = booking;

    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                    <Heading as="h1">Booking #{bookingId}</Heading>
                    <Tag
                        type={
                            statusToTagName[
                                status as
                                    | "unconfirmed"
                                    | "checked-in"
                                    | "checked-out"
                            ]
                        }
                    >
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                {status === "unconfirmed" && (
                    <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
                        Check in
                    </Button>
                )}

                {status === "checked-in" && (
                    <Button
                        onClick={() => checkout(bookingId)}
                        disabled={isCheckingOut}
                    >
                        Check out
                    </Button>
                )}

                <Modal>
                    <Modal.Open opens="confirm-booking-deletion">
                        {(open) => (
                            <Button variation="danger" onClick={open}>
                                Delete booking
                            </Button>
                        )}
                    </Modal.Open>

                    <Modal.Window name="confirm-booking-deletion">
                        {(close) => (
                            <ConfirmDelete
                                resourceName={"name"}
                                onConfirm={() =>
                                    // passing an object with 'onSettled' callback to navigate previous page
                                    deleteBooking(bookingId, {
                                        onSettled: () => {
                                            navigate(-1);
                                        },
                                    })
                                }
                                onCancel={close}
                                disabled={isBookingDeleting}
                            />
                        )}
                    </Modal.Window>
                </Modal>

                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
};
