import styled from "styled-components";

import { Row } from "../../ui/Row/Row";
import Heading from "../../ui/Heading/Heading";
import ButtonText from "../../ui/ButtonText/ButtonText";
import BookingDataBox from "../bookings/BookingDataBox/BookingDataBox";
import ButtonGroup from "../../ui/ButtonGroup/ButtonGroup";
import { Button } from "../../ui/Button/Button";
import { useBooking } from "../bookings/hooks/useBooking";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";
import Spinner from "../../ui/Spinner/Spinner";
import { useEffect, useState } from "react";
import { Checkbox } from "../../ui/Checkbox/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./useCheckin";
import { useMoveBack } from "../../hooks/useMoveBack";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

export const CheckinBooking = () => {
    const [confirmPaid, setConfirmPaid] = useState(false);
    const { booking, isBookingLoading, error } = useBooking();

    //
    const { checkin, isCheckingIn } = useCheckin();

    // dynamically update 'confirmPaid' state based on 'booking.isPaid' to update payment status
    useEffect(() => setConfirmPaid(booking.isPaid), [booking.isPaid]);

    const moveBack = useMoveBack();

    const {
        id: bookingId,
        guests,
        totalPrice,
        numGuests,
        hasBreakfast,
        numNights,
    } = booking;

    // call checkin mutation function and moveback to previous page
    const handleCheckin = () => {
        if (!confirmPaid) return;
        checkin(bookingId);
    };

    if (error) return <PageNotFound />;
    if (isBookingLoading) return <Spinner />;

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{bookingId}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <Box>
                <Checkbox
                    checked={confirmPaid}
                    onChange={() => setConfirmPaid((prev) => !prev)}
                    disabled={booking.isPaid || isCheckingIn}
                    id={1}
                >
                    I confirm that {guests?.fullName} has paid the total amount
                    of {formatCurrency(totalPrice)}
                </Checkbox>
            </Box>

            <ButtonGroup>
                <Button
                    onClick={handleCheckin}
                    disabled={!confirmPaid || isCheckingIn}
                >
                    Check in booking #{bookingId}
                </Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
};
