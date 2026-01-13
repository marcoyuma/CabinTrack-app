// external libraries
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../../../../ui/Form/Form";
import { Input } from "../../../../ui/Input/Input";
import { Button } from "../../../../ui/Button/Button";
import { FormRow } from "../../../../ui/FormRow/FormRow";
import { Textarea } from "../../../../ui/Textarea/Textarea";
import { FileInput } from "../../../../ui/FileInput/FileInput";

import { useUpdateCabin } from "../../hooks/useUpdateCabin";
import { useCreateCabin } from "../../hooks/useCreateCabin";
import {
    cabinFormSchema,
    CabinFormSchemaType,
    CabinPayload,
} from "../../types/cabin.schema";

// props type for CreateCabinForm component
export interface CreateCabinFormProps {
    editedCabinData?: {
        created_at: string;
        description: string;
        discount: number;
        id: number;
        image: FileList | null;
        maxCapacity: number;
        name: string;
        regularPrice: number;
    };
    onCloseModal?: () => void;
}

// component for creating cabin with react hook form
// no manual hookstate
export const CreateCabinForm = ({
    editedCabinData,
    onCloseModal,
}: CreateCabinFormProps) => {
    // destructure editedCabinData if available for default values
    let editId: undefined | number;
    const createValues: CabinFormSchemaType = {
        name: "",
        description: "",
        discount: 0,
        image: null,
        maxCapacity: 0,
        regularPrice: 0,
    };

    let editValues: CabinFormSchemaType;

    if (editedCabinData) {
        ({ id: editId, ...editValues } = editedCabinData);
        console.log(`editId: ${editId}`);
        console.log(`editValues: ${editValues}`);
        console.log(`editValues.image: ${editValues.image}`);
    }

    // on edit indicator
    const isEditSession = Boolean(editId);
    console.log(`isEditSession: ${isEditSession}`);

    // implementing useForm hook
    // Destructure 'register' and 'handleSubmit' from useForm to manage form inputs and submission
    const { register, handleSubmit, reset, formState } =
        // useForm<FormDataType>({
        useForm({
            // integrate zod schema with react hook form resolver via zod resolver for input validation
            resolver: zodResolver(cabinFormSchema),
            // conditional logic for if on edit session then use 'editValues' as default value from cabins query in each input
            // defaultValues: isEditSession ? editValues : createValues,
            defaultValues: isEditSession
                ? {
                      name: editedCabinData?.name,
                      description: editedCabinData?.description,
                      discount: Number(editedCabinData?.discount),
                      maxCapacity: Number(editedCabinData?.maxCapacity),
                      regularPrice: Number(editedCabinData?.regularPrice),
                  }
                : createValues,
        }); // dont forget to give the hook generic type

    const { errors } = formState;

    // hook for creating new cabin
    const { isCreating, createCabin } = useCreateCabin();

    // custom hook for updating cabin
    const { isUpdating, updateCabin } = useUpdateCabin();

    // combine both
    const isWorking = isCreating || isUpdating;

    // submit handler
    // const onSubmit: SubmitHandler<FormDataType> = (data): void => {
    const onSubmit: SubmitHandler<CabinFormSchemaType> = (data): void => {
        console.log(data);

        const cleanedData: CabinPayload = {
            name: data.name,
            description: data.description,
            discount: Number(data.discount),
            image:
                data.image instanceof FileList && data.image.length > 0
                    ? data.image[0]
                    : null,
            maxCapacity: Number(data.maxCapacity),
            regularPrice: Number(data.regularPrice),
        };

        // update only when in edit session and there's base id provided to update cabin properties
        if (isEditSession && editId) {
            updateCabin(
                {
                    // newCabinData: { ...data, image: image },
                    newCabinData: cleanedData,
                    id: editId,
                },
                {
                    onSuccess: (data) => {
                        console.log(data);
                        onCloseModal?.();
                        reset();
                    },
                }
            );

            // base isn't provided and not in edit session, create
        } else {
            // call renamed trigger function when form submitted with 'cleanedData' as argument
            createCabin(cleanedData, {
                onSuccess: (data) => {
                    console.log(data);
                    onCloseModal?.();
                    reset();
                },
            });
        }
    };

    // error handler
    const onError = (errors: FieldErrors) => {
        console.log(errors);
    };

    return (
        <Form
            onSubmit={handleSubmit(
                // success input will call this
                onSubmit,
                // error input will prevent submitting and call this
                onError
            )}
            // type is used to determine the style of the form
            // if onCloseModal is provided, then the form is used as a modal
            // otherwise, it is a regular form
            type={onCloseModal ? "modal" : "regular"}
            id="createCabin"
            name="createCabin"
        >
            <FormRow
                label="Cabin name"
                htmlFor="name"
                error={errors.name?.message}
            >
                {/* Register the input field with key "name" (as same as 'id' value input property) so React Hook Form can manage its state, value, and validation */}
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register("name")}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                htmlFor="maxCapacity"
                error={errors.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isWorking}
                    {...register("maxCapacity")}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                htmlFor="regularPrice"
                error={errors.regularPrice?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isWorking}
                    {...register("regularPrice")}
                />
            </FormRow>

            <FormRow
                label="Discount"
                htmlFor="discount"
                error={errors.discount?.message}
            >
                <Input
                    type="number"
                    id="discount"
                    disabled={isWorking}
                    {...register("discount")}
                />
            </FormRow>

            <FormRow
                label="Description for website"
                htmlFor="description"
                error={errors.description?.message}
            >
                <Textarea
                    // type="number"
                    id="description"
                    defaultValue=""
                    disabled={isWorking}
                    {...register(
                        "description"
                        // {
                        // required: "this field is required",}
                    )}
                />
            </FormRow>

            <FormRow
                label="Cabin photo"
                htmlFor="image"
                error={errors.image?.message}
            >
                <FileInput
                    id="image"
                    accept="image/*"
                    type="file"
                    {...register(
                        "image"
                        //      {
                        //     // validation either editin or creating. true condition wouldn't be required
                        //     required: isEditSession ? false : "image is required",
                        // }
                    )}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button
                    variation="secondary"
                    // 'type' property here is simply just regular html for resetting the form
                    type="reset"
                    onClick={onCloseModal}
                >
                    Cancel
                </Button>
                <Button disabled={isWorking}>
                    {isEditSession ? "Edit" : "Add"} cabin
                </Button>
            </FormRow>
        </Form>
    );
};
