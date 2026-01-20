// cabins filter properties
export type CabinFilterValue = "with-discount" | "no-discount" | undefined;

// cabin sort type
export type CabinSortValue = {
    field: CabinSortFieldProperty;
    direction: CabinSortDirectionProperty;
};
export type CabinSortFieldProperty = "name" | "regularPrice" | "maxCapacity";
export type CabinSortDirectionProperty = "asc" | "desc";
