import { BookingTable } from "../../features/bookings/components/BookingTable/BookingTable";
import { BookingTableOperations } from "../../features/bookings/components/BookingTableOperations/BookingTableOperations";
import { Heading } from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";

export const Bookings = () => {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All bookings</Heading>
                <BookingTableOperations />
            </Row>
            <BookingTable />
        </>
    );
};
