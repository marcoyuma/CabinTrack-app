import styled, { css } from "styled-components";
import {
    HiOutlineClipboardDocumentList,
    HiOutlineSparkles,
    HiOutlineCalendarDays,
    HiOutlineUserPlus,
} from "react-icons/hi2";
import Stat from "../../../ui/Stat/Stat";
import {
    BookingFinancialRow,
    isConfirmedStay,
} from "../types/dashboard.schema";
import { media } from "../../../styles/breakpoints";

interface StatsProps {
    totalBookingsCount: number;
    newGuestsCount: number;
    bookingFinancials?: BookingFinancialRow[];
}

// Own grid, decoupled from DashboardLayout's row-separating gap — spans the full row (all 4
// outer columns) as a single grid item, then lays out the 4 cards internally with a tighter gap.
// 1 column on mobile, 2 on tablet, 4 at desktop (grid-column: 1/-1 is a no-op until
// DashboardLayout switches to a grid at desktop).
const StatsGrid = styled.div`
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;

    ${media.tablet(css`
        grid-template-columns: repeat(2, 1fr);
    `)}

    ${media.desktop(css`
        grid-template-columns: repeat(4, 1fr);
    `)}
`;

/**
 * 4-card layout: Total Bookings (all-time) / New Booking (within the active date filter) /
 * Check-ins / New Guest — replaces the previous Bookings/Sales/Check-ins/Occupancy rate
 * layout. Occupancy rate was dropped, not moved — see DASHBOARD-STATS-REDESIGN.md for why.
 * "Sales" was replaced by "New Guest" (public.guests signups in the active date filter,
 * via admin_new_guests_count() — see 0017_admin_new_guests_count.sql) per explicit user request.
 * Synced with DashboardFilter's `last` URL param via useNewGuestsCount, same contract as
 * useBookingFinancials — see that hook for the shared date-range resolution.
 */
function Stats({
    totalBookingsCount,
    newGuestsCount,
    bookingFinancials,
}: StatsProps) {
    // New bookings created within the selected date filter — this is exactly what the old
    // "Bookings" stat measured, just relabeled and moved to second position.
    const newBookings = bookingFinancials?.length ?? 0;

    // Number of confirmed stays (checked-in or checked-out) within the selected date filter
    const checkins = (bookingFinancials?.filter(isConfirmedStay) ?? []).length;

    return (
        <StatsGrid>
            <Stat
                icon={<HiOutlineClipboardDocumentList />}
                title="Total Bookings"
                value={totalBookingsCount.toLocaleString()}
            />
            <Stat
                icon={<HiOutlineSparkles />}
                title="New Booking"
                value={newBookings.toLocaleString()}
            />
            <Stat
                icon={<HiOutlineCalendarDays />}
                title="Check in"
                value={checkins.toLocaleString()}
            />
            <Stat
                icon={<HiOutlineUserPlus />}
                title="New Guest"
                value={newGuestsCount.toLocaleString()}
            />
        </StatsGrid>
    );
}

export default Stats;
