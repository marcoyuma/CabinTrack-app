import styled from "styled-components";
import { format, parseISO } from "date-fns";
import { BookingRow as BookingRowData } from "../types/booking.types";
import { maskPhone } from "../utils/maskPhone";
import { CellLabel, Field, TableRowItem } from "./bookingTable.styles";

// Mirrors src/features/stays/components/StayRow.tsx's cell styling verbatim (font sizes,
// colors, spacing) — only the content differs.
const GuestText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
`;

const GuestName = styled.span`
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-grey-700);
`;

const GuestMeta = styled.span`
    font-size: 1.3rem;
    color: var(--color-grey-500);
`;

const Cell = styled.span`
    font-size: 1.4rem;
    color: var(--color-grey-600);
`;

const MutedCell = styled(Cell)`
    color: var(--color-grey-400);
`;

// Same pill treatment as Stays' StatusBadge, parameterized by booking status text instead of
// a ready/not-ready boolean. Colors mirror BookingRosterList.tsx's STATUS_TAG mapping.
const STATUS_STYLES: Record<string, { color: string; background: string }> = {
    confirmed: { color: "var(--color-blue-700)", background: "var(--color-blue-100)" },
    checked_in: { color: "var(--color-green-700)", background: "var(--color-green-100)" },
    checked_out: { color: "var(--color-silver-700)", background: "var(--color-silver-100)" },
    cancelled: { color: "var(--color-red-700)", background: "var(--color-red-100)" },
    no_show: { color: "var(--color-yellow-700)", background: "var(--color-yellow-100)" },
};

const StatusBadge = styled.span<{ $color: string; $background: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    width: fit-content;

    padding: 0.5rem 1.1rem;
    border-radius: 9999px;
    font-size: 1.2rem;
    font-weight: 600;

    color: ${({ $color }) => $color};
    background-color: ${({ $background }) => $background};
`;

const formatDate = (isoDate: string) => format(parseISO(isoDate), "d MMM yyyy");

interface BookingRowProps {
    booking: BookingRowData;
}

export function BookingRow({ booking }: BookingRowProps) {
    const statusStyle =
        STATUS_STYLES[booking.status] ??
        ({ color: "var(--color-grey-600)", background: "var(--color-grey-100)" } as const);

    return (
        <TableRowItem>
            <GuestText>
                <GuestName>{booking.guestName ?? "—"}</GuestName>
                <GuestMeta>{maskPhone(booking.phoneCountryCode, booking.phone)}</GuestMeta>
            </GuestText>

            <Field>
                <CellLabel>Villa</CellLabel>
                <Cell>{booking.stayName}</Cell>
            </Field>

            <Field>
                <CellLabel>Stay Dates</CellLabel>
                <Cell>
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                </Cell>
            </Field>

            <Field>
                <CellLabel>Nights</CellLabel>
                {booking.numNights !== null ? (
                    <Cell>{booking.numNights}</Cell>
                ) : (
                    <MutedCell>—</MutedCell>
                )}
            </Field>

            <Field>
                <CellLabel>Total Price</CellLabel>
                {booking.totalPrice !== null ? (
                    <Cell>Rp{booking.totalPrice.toLocaleString("id-ID")}</Cell>
                ) : (
                    <MutedCell>—</MutedCell>
                )}
            </Field>

            <Field>
                <CellLabel>Status</CellLabel>
                <StatusBadge $color={statusStyle.color} $background={statusStyle.background}>
                    {booking.status.replace("_", " ")}
                </StatusBadge>
            </Field>
        </TableRowItem>
    );
}
