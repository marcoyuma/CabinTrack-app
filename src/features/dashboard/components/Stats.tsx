import {
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineBanknotes,
    HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../../shared/utils/helpers";
import { RecentBookings, RecentStays } from "../types/dashboard.schema";

interface StatsProps {
    recentBookings?: RecentBookings;
    confirmedStays?: RecentStays;
    numDays: number;
    cabinCount: number;
}
function Stats({
    recentBookings,
    confirmedStays,
    numDays,
    cabinCount,
}: StatsProps) {
    // Stat 1)
    const numBookings = recentBookings?.length ?? 0;

    // Stat 2)
    const sales =
        recentBookings?.reduce((acc, cur) => acc + cur.totalPrice, 0) ?? 0;

    // Stat 3)
    const checkins = confirmedStays?.length ?? 0;

    // Stat 4)
    // We will use a trick to calculate occupancy rate. It's not 100% accurate, but we want to keep it simple. We know we can have a total of 'numDays * cabinCount' days to occupy, and we also know how many days were actually booked. From this, we can compute the percentage
    const totalNights =
        confirmedStays?.reduce((acc, cur) => acc + cur.numNights, 0) ?? 0;

    // Maximum possible occupied nights if all cabins are fully booked over the past N days
    const maxNightCapacity = numDays * cabinCount;

    const occupation =
        maxNightCapacity > 0 ? totalNights / maxNightCapacity : 0;

    console.log("totalNights: " + totalNights);
    console.log("maxNightCapacity: " + maxNightCapacity);
    console.log("occupation: " + occupation);

    return (
        <>
            <Stat
                icon={<HiOutlineBriefcase />}
                title="Bookings"
                value={numBookings}
                color="blue"
            />
            <Stat
                icon={<HiOutlineBanknotes />}
                title="Sales"
                value={formatCurrency(sales).toString()}
                color="green"
            />
            <Stat
                icon={<HiOutlineCalendarDays />}
                title="Check ins"
                value={checkins}
                color="indigo"
            />
            <Stat
                icon={<HiOutlineChartBar />}
                title="Occupancy rate"
                value={Math.round(occupation * 100) + "%"}
                color="yellow"
            />
        </>
    );
}

export default Stats;
