import { differenceInDays, formatDistance, parseISO } from "date-fns";

import z from "zod";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1: string, dateStr2: string) =>
    differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr: string) =>
    formatDistance(parseISO(dateStr), new Date(), {
        addSuffix: true,
    })
        .replace("about ", "")
        .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options?: { end: boolean }) {
    const today = new Date();

    // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
    if (options?.end)
        // Set to the last second of the day
        today.setUTCHours(23, 59, 59, 999);
    else today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
};

export const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
        value
    );

// AFTER REFACTOR 15-10-2025

// BEFORE REFACTOR 15-10-2025
// export const transformCabinDataTypeToFormValues = (
//     cabin: CabinDataToTransform
// ): EditedCabinDataAsReturnValues => ({
//     id: cabin.id,
//     created_at: cabin.created_at,
//     description: cabin.description ?? undefined,
//     discount: cabin.discount != null ? cabin.discount.toString() : undefined,
//     image: cabin.image ?? undefined,
//     maxCapacity:
//         cabin.maxCapacity != null ? cabin.maxCapacity.toString() : undefined,
//     name: cabin.name ?? undefined,
//     regularPrice:
//         cabin.regularPrice != null ? cabin.regularPrice.toString() : undefined,
// });

// MORE OPTIMAL CabinDataTypeToFormValues
export const sanitizeNull = <T>(value: T | undefined | null): T | undefined => {
    return value ?? undefined;
};
// generic function for sorting data dynamically
export const sortData = <T>(
    // data is T[] or undefined
    data: T[] | undefined,

    // base string to sort data
    sortBy: string
): T[] => {
    // early return if empty array received
    if (!data) return [];

    // desctructure that two splitted elements depends on '-' splitter. returned two length array
    // Type assertion: force split returned value become tuple [string, "asc" | "desc"] for type safety
    const [field, direction] = sortBy.split("-") as [string, "asc" | "desc"];

    // return sorted shallow copy of 'data' array
    return [...data].sort((a, b) => {
        const aValue = a[field as keyof typeof a];
        const bValue = b[field as keyof typeof b];

        // sort undefined and null value to back of the list
        if (!aValue) return 1;
        if (!bValue) return -1;

        // validation if type of value is string
        if (typeof aValue === "string" && typeof bValue === "string") {
            // return sorted value based on ternary 'direction' condition
            return direction === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        // validation type of value is number
        if (typeof aValue === "number" && typeof bValue === "number") {
            // return sorted value conditionally
            return direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        // value does not contain either string or number and there's no returned 'data' array
        return 0;
    });
};

// safe type for cabins, bookings, booking, guests schema
export const safeString = (fallback = "-") =>
    z
        .string()
        .nullable()
        .transform((arg) => arg ?? fallback)
        .default(fallback);
export const safeNumber = (fallback = 0) =>
    z
        .number()
        .nullable()
        .transform((arg) => arg ?? fallback)
        .default(fallback);
export const safeBoolean = (fallback = false) =>
    z
        .boolean()
        .nullable()
        .transform((arg) => arg ?? fallback)
        .default(fallback);

export const removeUndefined = <T>(obj: T) => {
    Object.entries(obj);
};

// safety for form
export const stringSafeForm = (min = 1, max?: number, message?: string) => {
    let safe = z.string().trim();
    if (max) {
        safe = safe
            .min(
                min,
                message ?? `minimal ${min} or ${max} length input is required`
            )
            .max(max);
    } else {
        safe = safe.min(min, message ?? `${min} or more input is required`);
    }
    return safe;
};
