import { PageNotFound } from "../../../pages/PageNotFound/PageNotFound";
import { Empty } from "../../../ui/Empty/Empty";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { useBooking } from "../../bookings/hooks/useBooking";
import { useSettings } from "../../settings/hooks/useSettings";
import { CheckinBookingInner } from "./CheckinBookingInner";

/**
 * Orchestrates the check-in booking flow by loading booking and settings data
 * and handling loading, error, and empty states before rendering the check-in UI
 */
export function CheckinBooking() {
    const { booking, isBookingLoading, errorBooking } = useBooking();
    const { isSettingLoading, setting, error: errorSettings } = useSettings();

    // error handling
    if (!booking) return <Empty resourceName="booking" />;
    if (errorBooking || errorSettings) return <PageNotFound />;
    if (isBookingLoading || isSettingLoading) return <Spinner />;

    return <CheckinBookingInner booking={booking} setting={setting} />;
}
