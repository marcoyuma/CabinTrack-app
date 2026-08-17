import { useEffect } from "react";
import type { SetManyParamsFn } from "./useBatchSearchParams";

/**
 * Keeps `page` query param valid against the latest paginated result metadata.
 *
 * Why this exists:
 * - Deleting items on the last page can make the current page out of range.
 * - Direct URL edits can set invalid page numbers.
 *
 * Behavior:
 * - If there are no results (`count === 0`) and current page is not `1`,
 *   force page back to `1`.
 * - If there are results and current page exceeds the computed last page,
 *   clamp page to `totalPagination`.
 *
 * Notes:
 * - This hook only synchronizes URL state. It does not fetch data itself.
 * - `setParams` should come from `useBatchSearchParams` so URL updates
 *   remain consistent across features.
 */
export function useEnsureValidPage(
    /** Total number of rows available for the current filter/sort scope. */
    count: number,
    /** Current page parsed from URL query params. */
    page: number,
    /** Last valid page, usually `Math.ceil(count / pageSize)`. */
    totalPagination: number,
    /** URL params updater (from `useBatchSearchParams`). */
    setParams: SetManyParamsFn,
) {
    useEffect(() => {
        if (count === 0 && page !== 1) {
            setParams({ page: "1" });
            return;
        }
        if (count > 0 && page > totalPagination) {
            setParams({ page: String(totalPagination) });
        }
    }, [count, page, totalPagination, setParams]);
}
