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

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    // hook for navigate programmatically
    const navigate = useNavigate();

    // custom hook to fetch booking data and its properties
    const { isBookingLoading, booking /*, error*/ } = useBooking();

    const { status, id: bookingId } = booking;

    const moveBack = useMoveBack();

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    if (isBookingLoading) return <Spinner />;

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
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
