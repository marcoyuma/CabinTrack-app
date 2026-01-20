import styled from "styled-components";

import { Row } from "../../../ui/Row/Row";
import { Heading } from "../../../ui/Heading/Heading";
import { ButtonText } from "../../../ui/ButtonText/ButtonText";
import { BookingDataBox } from "../../bookings/components/BookingDataBox/BookingDataBox";
import { ButtonGroup } from "../../../ui/ButtonGroup/ButtonGroup";
import { Button } from "../../../ui/Button/Button";
import { useEffect, useState } from "react";
import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { formatCurrency } from "../../../shared/utils/helpers";
import { useCheckin } from "../hooks/useCheckin";
import { useMoveBack } from "../../../hooks/useMoveBack";
import { useNavigate } from "react-router-dom";
import { DetailedBookingDataType } from "../../../types/bookings.type";

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2.4rem 4rem;
`;

interface CheckinBookingProps {
    booking: DetailedBookingDataType;
    setting: {
        id: number;
        breakfastPrice: number;
        maxBookingLength: number;
        maxNumberGuestsPerBooking: number;
        minBookingLength: number;
    };
}
export const CheckinBookingInner = ({
    booking,
    setting,
}: CheckinBookingProps) => {
    const [confirmPaid, setConfirmPaid] = useState(false);
    const [addBreakfast, setAddBreakfast] = useState(false);

    const { checkin, isCheckingIn } = useCheckin();

    const navigate = useNavigate();

    //

    const {
        id: bookingId,
        guests,
        totalPrice,
        numGuests,
        hasBreakfast,
        numNights,
        isPaid,
    } = booking;

    const optionalBreakfastPrice =
        setting.breakfastPrice * numNights * numGuests;

    // dynamically update 'confirmPaid' state based on 'booking.isPaid' to update payment status
    useEffect(() => setConfirmPaid(isPaid), [isPaid]);
    useEffect(() => setAddBreakfast(hasBreakfast), [hasBreakfast]);

    const moveBack = useMoveBack();

    // call checkin mutation function and moveback to previous page
    const handleCheckin = () => {
        if (!confirmPaid) return;
        if (addBreakfast) {
            checkin({
                bookingId,
                breakfast: {
                    hasBreakfast: true,
                    extrasPrice: optionalBreakfastPrice,
                    totalPrice: totalPrice + optionalBreakfastPrice,
                },
            });
        } else {
            checkin({
                bookingId,
                // no extra price and breakfast is based on has breakfast from the beginning
                breakfast: { extrasPrice: 0, hasBreakfast, totalPrice },
            });
        }
        navigate(-1);
    };

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Check in booking #{bookingId}</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <Box>
                <Checkbox
                    checked={addBreakfast}
                    onChange={() => {
                        setAddBreakfast((prev) => !prev);
                        setConfirmPaid(false);
                    }}
                    id={bookingId}
                >
                    Add breakfast for {formatCurrency(optionalBreakfastPrice)}?
                </Checkbox>
            </Box>
            <Box>
                <Checkbox
                    checked={confirmPaid}
                    onChange={() => setConfirmPaid((prev) => !prev)}
                    disabled={confirmPaid || isCheckingIn}
                    id={bookingId}
                >
                    I confirm that {guests?.fullName} has paid the total amount
                    of{" "}
                    {!addBreakfast
                        ? formatCurrency(totalPrice)
                        : `${formatCurrency(
                              totalPrice + optionalBreakfastPrice
                          )} (${formatCurrency(
                              totalPrice
                          )} cabin + ${formatCurrency(
                              optionalBreakfastPrice
                          )} breakfast)`}
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
