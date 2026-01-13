import { Empty } from "../../../../ui/Empty/Empty";
import { Pagination } from "../../../../ui/Pagination/Pagination";
import { Spinner } from "../../../../ui/Spinner/Spinner";
import { Table } from "../../../../ui/Table/Table";
import { useBookings } from "../../hooks/useBookings";
import { BookingRow } from "../BookingRow/BookingRow";

// main component for displaying bookings in a table format
export const BookingTable = () => {
    // get 'bookings' data from query
    const { bookings, isBookingsLoading, bookingsLength } = useBookings();

    // early validation
    if (isBookingsLoading) return <Spinner />;
    if (!bookings.length) return <Empty resourceName="bookings" />;

    return (
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
                {/* property count is necessary for decide how many pages will be provided based on total rows of data */}
                <Pagination count={bookingsLength} />
            </Table.Footer>
        </Table>
    );
};
