import { RecentStay } from "../types/dashboard.schema";

/**
 * Type guard to determine whether a stay is confirmed
 * (i.e. the guest has checked in or already checked out)
 */
export function isConfirmedStays(stays: RecentStay) {
    return stays.status === "checked-in" || stays.status === "checked-out";
}
