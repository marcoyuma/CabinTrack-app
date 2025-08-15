import { differenceInDays, formatDistance, parseISO } from "date-fns";
import { EditedCabinData } from "../pages/Cabins/CreateCabinForm/CreateCabinForm";
import { Cabin } from "../pages/Cabins/CabinRow/CabinRow";
import { NewCabin } from "../services/apiCabins";
import { FormDataType } from "../features/cabins/types/type";
// import { Cabin } from "../pages/Cabins/CabinRow/CabinRow";
// import { EditedCabinData } from "../pages/Cabins/CreateCabinForm/CreateCabinForm";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
    differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
    formatDistance(parseISO(dateStr), new Date(), {
        addSuffix: true,
    })
        .replace("about ", "")
        .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
    const today = new Date();

    // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
    if (options?.end)
        // Set to the last second of the day
        today.setUTCHours(23, 59, 59, 999);
    else today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
};

export const formatCurrency = (value) =>
    new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
        value
    );

// revert data type from null into undefined
// type reassign for parameter and return value
type CabinDataToTransform = Cabin;
type EditedCabinDataAsReturnValues = EditedCabinData["editedCabinData"];
export const transformCabinDataTypeToFormValues = (
    cabin: CabinDataToTransform
): EditedCabinDataAsReturnValues => ({
    id: cabin.id,
    created_at: cabin.created_at,
    description: cabin.description ?? undefined,
    discount: cabin.discount != null ? cabin.discount.toString() : undefined,
    image: cabin.image ?? undefined,
    maxCapacity:
        cabin.maxCapacity != null ? cabin.maxCapacity.toString() : undefined,
    name: cabin.name ?? undefined,
    regularPrice:
        cabin.regularPrice != null ? cabin.regularPrice.toString() : undefined,
});

// func for transforming type from input to upload-ready data
export const transformInputsIntoCompatibleType = (
    dataToConvert: FormDataType
): NewCabin => ({
    name: dataToConvert.name,
    maxCapacity: dataToConvert.maxCapacity ? +dataToConvert.maxCapacity : 0,
    regularPrice: dataToConvert.regularPrice ? +dataToConvert.regularPrice : 0,
    discount: dataToConvert.discount ? +dataToConvert.discount : 0,
    description: dataToConvert.description ?? "nothing to describe",
    // image data from filelist index[0] since it only allows one file per submit
    image: dataToConvert.image[0],
});

// reusable sanitized
// type NonNull<T> = { [K in keyof T]: T[K] };
// interface NullData {
//     id: null | number;
//     name: null | string;
// }
// export const sanitize = <T>(data: T): NonNullable<T> => {
//     return data;
// };
// console.log(sanitize({ id: null, name: "ags" }).id);
