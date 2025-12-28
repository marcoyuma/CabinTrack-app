import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { SubmitHandler, useForm } from "react-hook-form";

import {
    UpdateUserDataSchema,
    updateUserDataSchema,
} from "../types/auth.updateUserData.schema";

import { Form } from "../../../ui/Form/Form";
import { Input } from "../../../ui/Input/Input";
import { Button } from "../../../ui/Button/Button";
import { FormRow } from "../../../ui/FormRow/FormRow";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { FileInput } from "../../../ui/FileInput/FileInput";

interface UserMetadata {
    fullName?: string;
    avatar?: string | FileList;
}

export const UpdateUserDataFormInner = ({ user }: { user: User }) => {
    const email = user.email;
    const userMetaData: UserMetadata = user.user_metadata;
    const { fullName: currentFullName, avatar } = userMetaData;

    const {
        register,
        resetField,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(updateUserDataSchema),
        defaultValues: {
            email: email,
            fullName: currentFullName,
        },
    });

    const { updateUser, isUpdatingNewUser } = useUpdateUser();

    const onSubmit: SubmitHandler<UpdateUserDataSchema> = ({
        fullName,
        avatar,
    }) => {
        if (!fullName) return;
        if (avatar) {
            // imageFile =
            console.log(avatar[0]);
            updateUser(
                {
                    fullName,
                    email,
                    avatar: typeof avatar === "string" ? avatar : avatar[0],
                },
                {
                    onSuccess: () => {
                        // setAvatar(null);
                        // Resetting form using .reset() that's available on all HTML form elements, otherwise the old filename will stay displayed in the UI
                        // e.target.reset();
                        // resetField("fullName");
                        // resetField("avatar");
                    },
                }
            );
        } else {
            updateUser(
                { fullName, email },
                {
                    onSuccess: () => {
                        // resetField("fullName");
                    },
                }
            );
        }
    };

    const handleCancel = () => {
        resetField("fullName", { defaultValue: "" });
        resetField("avatar");
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormRow error={errors.email?.message} label="Email address">
                <Input
                    {...register("email")}
                    // value={email}
                    disabled
                />
            </FormRow>
            <FormRow error={errors.fullName?.message} label="Full name">
                <Input
                    {...register("fullName")}
                    type="text"
                    // value={fullName}
                    // onChange={(e) => setFullName(e.target.value)}
                    // disabled={isUpdating}
                    id="fullName"
                />
            </FormRow>
            <FormRow error={errors.avatar?.message} label="Avatar image">
                <FileInput
                    // disabled={isUpdating}
                    id="avatar"
                    accept="image/*"
                    // onChange={(e) => setAvatar(e.target.files[0])}
                    // We should also validate that it's actually an image, but never mind
                    {...register("avatar")}
                />
            </FormRow>
            <FormRow>
                <Button
                    onClick={handleCancel}
                    // type="reset"
                    variation="secondary"
                >
                    Cancel
                </Button>
                <Button
                // disabled={isUpdating}
                >
                    Update account
                </Button>
            </FormRow>
        </Form>
    );
};
