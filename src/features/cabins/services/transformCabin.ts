import { Cabin } from "../types/cabin.schema";

export const transformCabin = (cabin: Cabin) => {
    console.log(cabin);

    return {
        id: cabin.id,
        created_at: cabin.created_at,
        name: cabin.name,
        description: cabin.description,
        discount: cabin.discount.toString(),
        image: cabin.image,
        maxCapacity: cabin.maxCapacity.toString(),
        regularPrice: cabin.regularPrice.toString(),
    };
};
