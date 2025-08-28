import styled from "styled-components";
import { format, isToday } from "date-fns";

import { Table } from "../../../ui/Table/Table";
import Tag from "../../../ui/Tag/Tag";
import { BookingType } from "../types/type";
import { GuestType } from "../../guests/types/type";

import {
    formatCurrency,
    formatDistanceFromNow,
    sanitizeNull,
} from "../../../utils/helpers";
import { CabinType } from "../../../services/types/cabins.type";

// rejoin 3 table types
// id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice
type Booking = Pick<
    BookingType,
    | "id"
    | "created_at"
    | "startDate"
    | "endDate"
    | "numNights"
    | "numGuests"
    | "status"
    | "totalPrice"
> & {
    cabins: Pick<CabinType, "name"> | null;
    guests: Pick<GuestType, "fullName" | "email"> | null;
};

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;

    & span:first-child {
        font-weight: 500;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.2rem;
    }
`;

const Amount = styled.div`
    font-family: "Sono";
    font-weight: 500;
`;

function BookingRow({ booking }: { booking: Booking }) {
    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    const {
        id: bookingId,
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        totalPrice,
        status: bookingStatus,
        guests,
        cabins,
    } = booking;

    const cabinName = cabins?.name ?? "-";
    const guestName = guests?.fullName ?? "-";
    const email = guests?.email ?? "-";

    // immediately invoke function to clean up 'status' as key for 'statusToTagName'
    const status = ((): keyof typeof statusToTagName => {
        const normalize = sanitizeNull(bookingStatus);
        return normalize && normalize in statusToTagName
            ? (normalize as keyof typeof statusToTagName)
            : "unconfirmed";
    })();

    return (
        <Table.Row>
            <Cabin>{cabinName}</Cabin>

            <Stacked>
                <span>{guestName}</span>
                <span>{email}</span>
            </Stacked>

            <Stacked>
                <span>
                    {isToday(new Date(startDate ?? 0))
                        ? "Today"
                        : formatDistanceFromNow(startDate)}{" "}
                    &rarr; {numNights} night stay
                </span>
                <span>
                    {format(new Date(startDate ?? 0), "MMM dd yyyy")} &mdash;{" "}
                    {format(new Date(endDate ?? 0), "MMM dd yyyy")}
                </span>
            </Stacked>

            <Tag type={statusToTagName[status]}>
                {status?.replace("-", " ")}
            </Tag>

            <Amount>{formatCurrency(totalPrice)}</Amount>
        </Table.Row>
    );
}

export default BookingRow;
