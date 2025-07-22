export type FormDataType = {
    name: string | undefined;
    maxCapacity: string | undefined;
    regularPrice: string | undefined;
    discount: string | undefined;
    description: string | undefined;
    // type for default file input
    image: FileList;
};
