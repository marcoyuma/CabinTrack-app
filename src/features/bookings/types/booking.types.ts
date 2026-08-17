// Merge of admin_booking_roster() and admin_booking_financials() by booking_id — neither RPC
// alone carries everything a booking list needs (roster has guest identity, financials has
// nights/price), and their date filters aren't the same thing (roster: stay-date overlap,
// financials: created_at). A row that only came from one side of the union leaves the other
// side's fields null, rendered as "—" by BookingRow rather than treated as an error.
export interface BookingRow {
    bookingId: number;
    stayName: string;
    guestName: string | null;
    phoneCountryCode: string | null;
    phone: string | null;
    startDate: string;
    endDate: string;
    status: string;
    numNights: number | null;
    totalPrice: number | null;
}
