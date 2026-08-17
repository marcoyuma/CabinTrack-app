import supabase from "../../../supabase/supabase";

/**
 * Turns a derived base slug into one that isn't taken yet, appending a numeric suffix on
 * conflict: `villa-sunset` → `villa-sunset-2` → `villa-sunset-3`.
 *
 * See STAYS-INPUT-DECISIONS.md decision 1 for why a trailing counter beats prefixing an id —
 * the villa name stays the readable head of the public URL, and the result is deterministic
 * (re-derivable by re-running this check) rather than random.
 *
 * One `like` query fetches every existing slug in the family instead of probing candidates one
 * at a time, so the round-trip count doesn't grow with the number of same-named villas.
 *
 * This is a check-then-insert, so it is not race-proof: two staff saving the same name within
 * the same instant can both resolve to the same slug. The `unique` constraint on `stays.slug`
 * remains the real guarantee — createStay.ts translates its violation into a retry message.
 *
 * @param baseSlug output of deriveSlug() — already lowercase/hyphenated
 * @returns the base slug itself when free, otherwise the base plus the lowest free suffix
 */
export const resolveUniqueSlug = async (baseSlug: string): Promise<string> => {
    const { data, error } = await supabase
        .from("stays")
        .select("slug")
        .like("slug", `${baseSlug}%`);

    if (error) {
        console.error(error);
        throw new Error("server error, the villa's URL could not be checked");
    }

    const taken = new Set(data.map((row) => row.slug));
    if (!taken.has(baseSlug)) return baseSlug;

    // Starts at 2 so the first duplicate reads "-2" (the second villa of that name), not "-1".
    let suffix = 2;
    while (taken.has(`${baseSlug}-${suffix}`)) suffix++;

    return `${baseSlug}-${suffix}`;
};
