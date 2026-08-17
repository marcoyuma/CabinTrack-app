import supabase from "../../../supabase/supabase";
import { Database } from "../../../supabase/types/database.types";
import { StayCreateInput } from "../types/stay-create.schema";

type StayInsert = Database["public"]["Tables"]["stays"]["Insert"];

// Postgres unique violation — stays.slug is unique. resolveUniqueSlug() already picked a free
// slug, so reaching this means another staff member inserted the same one in between the check
// and this insert. Rare, recoverable by retrying, and worth saying so rather than showing the
// raw constraint name.
const UNIQUE_VIOLATION = "23505";
// Postgres check-constraint violation — the zod schemas mirror every stays_* constraint, so
// this should never fire through the form. Kept as a safety net for anything that bypasses
// zod (a race condition, a future caller of this service) so the failure stays specific
// instead of falling through to the generic message below.
const CHECK_VIOLATION = "23514";

// Inserts one stays row. Point-of-no-return step of the create-villa flow: once this succeeds,
// useCreateStay treats the villa as "created" even if a later step (images/amenities) fails —
// see useCreateStay.ts for why no rollback is attempted on partial failure.
//
// `slug` arrives separately from the form values because it is derived and de-duplicated by the
// caller rather than typed (STAYS-INPUT-DECISIONS.md decision 1).
export const createStay = async (
    input: Omit<StayCreateInput, "amenityIds">,
    slug: string,
): Promise<Database["public"]["Tables"]["stays"]["Row"]> => {
    const payload: StayInsert = {
        slug,
        name: input.name,
        location: input.location,
        price_per_night: input.price_per_night,
        discount: input.discount,
        capacity: input.capacity,
        beds: input.beds,
        area: input.area,
        is_new: input.is_new,
        is_featured: input.is_featured,
        description: input.description,
        lat: input.lat,
        lng: input.lng,
    };

    const { data, error } = await supabase
        .from("stays")
        .insert(payload)
        .select()
        .single();

    if (error) {
        if (error.code === UNIQUE_VIOLATION) {
            throw new Error(
                "Another villa just took this URL — save again to get the next available one.",
            );
        }
        if (error.code === CHECK_VIOLATION) {
            console.error(error);
            throw new Error(
                "One of the values doesn't meet the villa's data rules (price, discount, capacity, beds, or area) — check the form and try again.",
            );
        }
        console.error(error);
        throw new Error("server error, villa could not be created");
    }

    return data;
};
