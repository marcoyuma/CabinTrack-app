import { format, parseISO } from "date-fns";
import styled from "styled-components";
import { Row } from "../../../ui/Row/Row";
import { Heading } from "../../../ui/Heading/Heading";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { Tag } from "../../../ui/Tag/Tag";
import { useBookingRoster } from "../hooks/useBookingRoster";
import { BookingRosterRow } from "../types/dashboard.schema";
import { maskPhone } from "../../bookings/utils/maskPhone";

const StyledRoster = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-lg);

    padding: 3.2rem;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    grid-column: 1 / span 2;
    padding-top: 2.4rem;
`;

const RosterList = styled.ul`
    overflow: scroll;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 0 !important;
    }
    scrollbar-width: none;
    -ms-overflow-style: none;
`;

const StyledRosterItem = styled.li`
    display: grid;
    grid-template-columns: 9rem 1fr 12rem 10rem;
    gap: 1.2rem;
    align-items: center;

    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const Guest = styled.div`
    font-weight: 500;
`;

const Empty = styled.p`
    text-align: center;
    font-size: 1.8rem;
    font-weight: 500;
    margin-top: 0.8rem;
`;

// Booking status values live in the customer-site schema (public.bookings.status:
// confirmed | checked_in | checked_out | cancelled | no_show — see
// ADMIN-PANEL-CONTEXT.md § "public.bookings"). Anything unrecognized falls back to a plain
// grey tag rather than crashing on an unmapped value.
const STATUS_TAG: Record<string, string> = {
    confirmed: "blue",
    checked_in: "green",
    checked_out: "grey",
    cancelled: "red",
    no_show: "yellow",
};

const formatDate = (isoDate: string) => format(parseISO(isoDate), "d MMM");

function RosterItem({ row }: { row: BookingRosterRow }) {
    return (
        <StyledRosterItem>
            <Tag type={STATUS_TAG[row.status] ?? "grey"}>
                {row.status.replace("_", " ")}
            </Tag>
            <Guest>
                {row.guest_name} &middot; {row.stay_name}
            </Guest>
            <div>
                {formatDate(row.start_date)} &rarr; {formatDate(row.end_date)}
            </div>
            <div>{maskPhone(row.phone_country_code, row.phone)}</div>
        </StyledRosterItem>
    );
}

/**
 * Arrival/departure roster for staff, sourced from admin_booking_roster() — replaces the
 * old TodayActivity (which queried `bookings` directly, outside admin panel authority).
 * An empty result here can legitimately mean "no bookings in range" OR "signed-in account
 * has no public.staff row" — both render as the same empty state by design (see
 * ADMIN-PANEL-CONTEXT.md: "pemanggil yang tidak berhak mendapat 0 baris, bukan error").
 */
export function BookingRosterList() {
    const { isPending, roster } = useBookingRoster();

    return (
        <StyledRoster>
            <Row type="horizontal">
                <Heading as="h2">Today</Heading>
            </Row>

            {isPending ? (
                <Spinner />
            ) : roster.length > 0 ? (
                <RosterList>
                    {roster.map((row) => (
                        <RosterItem row={row} key={row.booking_id} />
                    ))}
                </RosterList>
            ) : (
                <Empty>No activity today...</Empty>
            )}
        </StyledRoster>
    );
}
