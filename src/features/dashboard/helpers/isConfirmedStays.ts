import { RecentStay } from "../types/dashboard.schema";

export function isConfirmedStays(stays: RecentStay) {
    return stays.status === "checked-in" || stays.status === "checked-out";
}
