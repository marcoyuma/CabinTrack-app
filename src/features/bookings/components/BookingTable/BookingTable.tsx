import { Menus } from "../../../../ui/Menus/Menus";
import { Pagination } from "../../../../ui/Pagination/Pagination";
import { Spinner } from "../../../../ui/Spinner/Spinner";
import { Table } from "../../../../ui/Table/Table";
import { useBookings } from "../../hooks/useBookings";
import { BookingRow } from "../BookingRow/BookingRow";

/**
 * Renders the bookings list as a paginated table.
 *
 * This component does not build query logic itself. It relies on `useBookings`
 * to read URL params, fetch rows, and return both the current page rows and the
 * total number of matching rows from the backend.
 *
 * During initial load it returns a spinner. Once data is ready, each booking is
 * rendered through `BookingRow` inside the shared `Table` primitives.
 *
 * `Menus` wraps the table because row action menus depend on that context.
 * `Pagination` receives `bookingsLength` (total rows), so page calculation stays
 * accurate even when the current page contains only a subset of rows.
 */
export function BookingTable() {
    // Data + loading state from booking query hook.
    const { bookings, isBookingsLoading, bookingsLength } = useBookings();

    // Avoid rendering table skeleton while query is still loading.
    if (isBookingsLoading) return <Spinner />;

    return (
        <Menus>
            <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
                <Table.Header>
                    <div>Cabin</div>
                    <div>Guest</div>
                    <div>Dates</div>
                    <div>Status</div>
                    <div>Amount</div>
                    <div></div>
                </Table.Header>

                <Table.Body
                    data={bookings}
                    render={(booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                    )}
                />

                <Table.Footer>
                    {/* Use total rows to compute correct pagination boundaries. */}
                    <Pagination count={bookingsLength} />
                </Table.Footer>
            </Table>
        </Menus>
    );
}
