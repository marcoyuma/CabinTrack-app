/**
 * Derives a URL slug from a villa name, matching the DB's own `stays_slug_format` check
 * (`^[a-z0-9]+(-[a-z0-9]+)*$`).
 *
 * Staff no longer type slugs by hand — see STAYS-INPUT-DECISIONS.md decision 1. Typing them
 * produced silent unique-violation rollbacks with no useful message, and a slug is a public URL
 * segment, not something worth two chances to get wrong.
 *
 * NFD + dropping combining marks (`\p{M}`) folds accents onto their base letter (`Café` →
 * `cafe`) so a normal villa name doesn't lose whole words to the strip step below.
 *
 * @example
 * deriveSlug("Tuscan Twilight Villa")  // "tuscan-twilight-villa"
 * deriveSlug("  Villa  Cafe 42! ")     // "villa-cafe-42"
 */
export function deriveSlug(name: string): string {
    return name
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
