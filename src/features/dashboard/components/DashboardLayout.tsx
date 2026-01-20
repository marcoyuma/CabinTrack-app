import styled from "styled-components";
import { Spinner } from "../../../ui/Spinner/Spinner";
import { useRecentBookings } from "../hooks/useRecentBookings";
import { useRecentStays } from "../hooks/useRecentStays";
import Stats from "./Stats";
import { useCabins } from "../../cabins/hooks/useCabins";
import { SalesChart } from "./SalesChart";
import { DurationChart } from "./DurationChart";
import { TodayActivity } from "../../check-in-out/components/TodayActivity";

// import DurationChart from 'features/dashboard/DurationChart';
// import SalesChart from 'features/dashboard/SalesChart';
// import Stats from 'features/dashboard/Stats';
// import TodayActivity from 'features/check-in-out/TodayActivity';
// import { useRecentBookings } from 'features/dashboard/useRecentBookings';
// import Spinner from 'ui/Spinner';
// import { useRecentStays } from './useRecentStays';
// import { useCabins } from 'features/cabins/useCabins';

const StyledDashboardLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 34rem auto;
    gap: 2.4rem;
`;

/*
We need to distinguish between two types of data here:
1) BOOKINGS: the actual sales. For example, in the last 30 days, the hotel might have sold 10 bookings online, but these guests might only arrive and check in in the far future (or not, as booking also happen on-site)
2) STAYS: the actual check-in of guests arriving for their bookings. We can identify stays by their startDate, together with a status of either 'checked-in' (for current stays) or 'checked-out' (for past stays)
*/
function DashboardLayout() {
    const { recentBookings, isRecentBookingLoading } = useRecentBookings();
    const { isRecentStayLoading, confirmedStays, numDays } = useRecentStays();
    const { isPending: isCabinLoading, cabinsLength } = useCabins();

    // if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;
    if (isRecentBookingLoading || isRecentStayLoading || isCabinLoading) {
        return <Spinner />;
    }

    console.log("recentBookings");
    console.log(recentBookings);
    console.log("confirmedStays");
    console.log(confirmedStays);

    return (
        <StyledDashboardLayout>
            <Stats
                recentBookings={recentBookings}
                confirmedStays={confirmedStays}
                cabinCount={cabinsLength}
                numDays={numDays}
            />
            <TodayActivity />
            <DurationChart confirmedStays={confirmedStays} />
            <SalesChart recentBookings={recentBookings} numDays={numDays} />
        </StyledDashboardLayout>
    );
}

export default DashboardLayout;
