import supabase from "../../../supabase/supabase";
import { Database } from "../../../supabase/types/database.types";

type StayUpdate = Database["public"]["Tables"]["stays"]["Update"];
type StayRow = Database["public"]["Tables"]["stays"]["Row"];

// Postgres check-constraint violation — the zod schemas mirror every stays_* constraint, so
// this should never fire through the edit form. Kept as a safety net for anything that
// bypasses zod (a race condition, a future caller of this service) so the failure stays
// specific instead of falling through to the generic message below.
const CHECK_VIOLATION = "23514";

// Partial update of a single stays row — used both for a one-field toggle (is_new/is_featured
// from the table) and the full edit form, so the payload is left generic rather than a fixed
// shape like createStay's.
export const updateStay = async (id: number, payload: StayUpdate): Promise<StayRow> => {
    const { data, error } = await supabase
        .from("stays")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        if (error.code === CHECK_VIOLATION) {
            console.error(error);
            throw new Error(
                "One of the values doesn't meet the villa's data rules (price, discount, capacity, beds, or area) — check the form and try again.",
            );
        }
        console.error(error);
        throw new Error("server error, villa could not be updated");
    }

    return data;
};
