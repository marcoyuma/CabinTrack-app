import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../../services/apiBookings";

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
