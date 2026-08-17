import { subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useBatchSearchParams } from "../../../hooks/useBatchSearchParams";
import supabase from "../../../supabase/supabase";
import { resolveNumDays } from "../types/dashboard.schema";

// Calls public.admin_new_guests_count(p_from, p_to) — count-only, no guest row ever leaves
// Postgres. See 0017_admin_new_guests_count.sql. Same "Last N days" URL-param contract
// (DashboardFilter/`last`) as useBookingFinancials, so this stat moves with the same filter.
const getNewGuestsCount = async (from: Date, to: Date): Promise<number> => {
    const { data, error } = await supabase.rpc("admin_new_guests_count", {
        p_from: from.toISOString().slice(0, 10),
        p_to: to.toISOString().slice(0, 10),
    });

    if (error) {
        console.error(error);
        throw new Error("server error, new guest count could not be loaded");
    }

    return data ?? 0;
};

export function useNewGuestsCount() {
    const [params] = useBatchSearchParams();
    const numDays = resolveNumDays(params.get("last"));

    const to = new Date();
    const from = subDays(to, numDays);

    const { data: newGuestsCount, isPending: isNewGuestsCountLoading } = useQuery({
        queryKey: ["new-guests-count", `last-${numDays}-days`],
        queryFn: () => getNewGuestsCount(from, to),
    });

    return { newGuestsCount: newGuestsCount ?? 0, isNewGuestsCountLoading };
}
