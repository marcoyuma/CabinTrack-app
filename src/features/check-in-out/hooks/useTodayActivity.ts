import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../../services/apiBookings";

/**
 * Custom React Query hook to fetch and manage today's check-in and check-out stay activities
 *
 * @returns An object containing today's stay activities data, loading state, and error state
 */
export function useTodayActivity() {
    const {
        data: todayStayActivities,
        isLoading: isTodayStayActivitiesLoading,
        error: todayStayActivitiesError,
    } = useQuery({
        queryKey: ["today-activity"],
        queryFn: getStaysTodayActivity,
    });

    return {
        todayStayActivities,
        isTodayStayActivitiesLoading,
        todayStayActivitiesError,
    };
}
