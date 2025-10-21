// external libraries
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Form from "../../../ui/Form/Form";
import { Button } from "../../../ui/Button/Button";
import Textarea from "../../../ui/Textarea/Textarea";
import FileInput from "../../../ui/FileInput/FileInput";
import Input from "../../../ui/Input/Input";
import { FormRow } from "../../../ui/FormRow/FormRow";

import { useUpdateCabin } from "../hooks/useUpdateCabin";
import { useCreateCabin } from "../hooks/useCreateCabin";

import {
    CreateCabinFormProps,
    FormDataType,
} from "../../../services/types/cabins.type";

// component for creating cabin with react hook form
// no manual hookstate
export const CreateCabinForm = ({
    editedCabinData,
    onCloseModal,
}: CreateCabinFormProps) => {
    // destructure and rename data from props
    const { id: editId, ...editValues } = editedCabinData ?? {};

    // on edit indicator
    const isEditSession = Boolean(editId);

    // Destructure 'register' and 'handleSubmit' from useForm to manage form inputs and submission
    const { register, handleSubmit, reset, getValues, formState } =
        // useForm<FormDataType>({
        useForm<CabinFormSchemaType>({
            // integrate zod schema with react hook form resolver via zod resolver for input validation
            resolver: zodResolver(cabinFormSchema),
            // conditional logic for if on edit session then use 'editValues' as default value from cabins query in each input
            defaultValues: isEditSession
                ? editValues
                : ({} as CabinFormSchemaType),
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
        const image =
            typeof data.image === "string" ? data.image : data.image[0];

        if (isEditSession) {
            updateCabin(
                {
                    newCabinData: { ...data, image: image },
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
        } else {
            // call renamed trigger function when form submitted with 'data' as argument
            createCabin(
                {
                    ...data,
                    // redefine specially for 'image' property with type of 'File' or 'FileList' and passed the 'name' file property
                    image: image,
                },
                {
                    onSuccess: (data) => {
                        console.log(data);
                        onCloseModal?.();
                        reset();
                    },
                }
            );
        }
    };

    // error handler
    const onError: SubmitErrorHandler<CabinFormSchemaType> = (errors) => {
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
        >
            <FormRow
                label={{ htmlfor: "name", labelChild: "Cabin name" }}
                errors={errors.name?.message}
            >
                {/* Register the input field with key "name" (as same as 'id' value input property) so React Hook Form can manage its state, value, and validation */}
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register("name", {
                        // validation input is required
                        required: "this field is required",
                        // minimal length of input is 3 characters validation
                        minLength: {
                            // string
                            value: 2,
                            message: "name should be atleast 2 characters",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label={{
                    htmlfor: "maxCapacity",
                    labelChild: "Maximum capacity",
                }}
                errors={errors.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isWorking}
                    {...register("maxCapacity", {
                        required: "this field is required",
                        // minimal number validation to input
                        min: {
                            value: 1, // input atleast greater than zero
                            message:
                                "there's should be more than zero people capacity",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label={{ htmlfor: "regularPrice", labelChild: "Regular price" }}
                errors={errors.regularPrice?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isWorking}
                    {...register("regularPrice", {
                        required: "this field is required",
                        min: {
                            value: 1,
                            message: "the price shouldn't be free",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label={{ htmlfor: "discount", labelChild: "Discount" }}
                errors={errors.discount?.message}
            >
                <Input
                    type="number"
                    id="discount"
                    // to make sure by default this value is zero
                    defaultValue={0}
                    disabled={isWorking}
                    {...register("discount", {
                        required: "this field is required",
                        // 'discount' must be lower then price validation using validate
                        validate: (
                            value // 'value' is the input data itself
                        ) =>
                            // 'value' must lower otherwise the string will returned and form isn't submitted
                            (value ? +value : 0) <=
                                Number(getValues().regularPrice) || // 'getValues' function will return all input object values then get the value, in this case is 'regularPrice'
                            "discount should be lower than the actual price",
                    })}
                />
            </FormRow>

            <FormRow
                label={{
                    htmlfor: "description",
                    labelChild: "Description for website",
                }}
                errors={errors.description?.message}
            >
                <Textarea
                    // type="number"
                    id="description"
                    defaultValue=""
                    disabled={isWorking}
                    {...register("description", {
                        required: "this field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label={{ htmlfor: "image", labelChild: "Cabin photo" }}
                errors={errors.image?.message}
            >
                <FileInput
                    id="image"
                    accept="image/*"
                    type="file"
                    {...register("image", {
                        // validation either editin or creating. true condition wouldn't be required
                        required: isEditSession ? false : "image is required",
                    })}
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
