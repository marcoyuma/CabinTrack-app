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
    avatar?: FileList;
}

/**
 * Handles updating the current user's profile information and avatar
 */
export const UpdateUserDataFormInner = ({ user }: { user: User }) => {
    const email = user.email;
    const userMetaData: UserMetadata = user.user_metadata;
    const { fullName: currentFullName } = userMetaData;

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
            updateUser({
                fullName,
                email,
                avatar: avatar[0],
            });
        } else {
            updateUser({ fullName, email });
        }
    };

    const handleCancel = () => {
        resetField("fullName", { defaultValue: "" });
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit)}
            id="updateUserData"
            name="updateUserData"
        >
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
                <Button disabled={isUpdatingNewUser}>Update account</Button>
            </FormRow>
        </Form>
    );
};
