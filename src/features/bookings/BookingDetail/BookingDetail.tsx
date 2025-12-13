import styled from "styled-components";
import { useMoveBack } from "../../../hooks/useMoveBack";
import { Row } from "../../../ui/Row/Row";
import Heading from "../../../ui/Heading/Heading";
import Tag from "../../../ui/Tag/Tag";
import ButtonText from "../../../ui/ButtonText/ButtonText";
import BookingDataBox from "../BookingDataBox/BookingDataBox";
import ButtonGroup from "../../../ui/ButtonGroup/ButtonGroup";
import { Button } from "../../../ui/Button/Button";
import { useBooking } from "../hooks/useBooking";
import Spinner from "../../../ui/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../../../pages/PageNotFound/PageNotFound";
import { useCheckout } from "../../check-in-out/useCheckout";
import { useDeleteBooking } from "../hooks/useDeleteBooking";
import { Modal } from "../../../ui/Modal/Modal";
import { ConfirmDelete } from "../../../ui/ConfirmDelete/ConfirmDelete";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    // hook for navigate programmatically
    const navigate = useNavigate();
    const { checkout, isCheckingOut } = useCheckout();
    const { deleteBooking, isBookingDeleting } = useDeleteBooking();

    // custom hook to fetch booking data and its properties
    const { isBookingLoading, booking /*, error*/ } = useBooking();

    // destructuring 'status' for 'Tag' component 'type' property and 'id' for displaying booking id
    const { status, id: bookingId } = booking;

    const moveBack = useMoveBack();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    if (isBookingLoading) return <Spinner />;

    // ! TEMPORARY,
    if (!bookingId) return <PageNotFound />;

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
                    <Button onClick={() => checkout({ bookingId })}>
                        Check out
                    </Button>
                )}

                {/* {status === "checked-out" && (
                    <Button
                        onClick={() => deleteBooking(bookingId)}
                        disabled={isBookingDeleting}
                    >
                        Delete
                    </Button>
                )} */}

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
}

export default BookingDetail;
