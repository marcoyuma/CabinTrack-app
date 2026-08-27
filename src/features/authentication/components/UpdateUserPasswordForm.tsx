import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { Form } from "../../../ui/Form/Form";
import { FormRow } from "../../../ui/FormRow/FormRow";
import { Input } from "../../../ui/Input/Input";
import { MouseEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    updateUserPasswordFormSchema,
    UpdateUserPasswordFormSchemaType,
} from "../types/auth.updatePasswordForm.schema";
import { Button } from "../../../ui/Button/Button";
import { useUpdateUser } from "../hooks/useUpdateUser";

export function UpdateUserPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(updateUserPasswordFormSchema) });
    // const { errors } = formState;

    const { updateUser, isUpdatingNewUser } = useUpdateUser();

    const onSubmit: SubmitHandler<UpdateUserPasswordFormSchemaType> = ({
        password,
    }: {
        password: string;
    }) => {
        updateUser({ password }, { onSuccess: () => reset() });
    };

    const onError = (error: FieldErrors) => {
        console.error(error);
    };

    // Suppresses the browser's native form reset so react-hook-form's reset() is the only
    // one that runs — it also clears validation errors, which the native reset leaves behind.
    const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        reset();
    };

    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            id="updateUserPassword"
            name="updateUserPassword"
        >
            <FormRow
                label="Password (min 8 characters)"
                error={errors.password?.message}
            >
                <Input
                    type="password"
                    id="password"
                    // this makes the form better for password managers
                    autoComplete="current-password"
                    // disabled={isUpdating}
                    {...register("password")}
                />
            </FormRow>

            <FormRow
                label="Confirm password"
                error={errors.passwordConfirm?.message}
            >
                <Input
                    type="password"
                    autoComplete="new-password"
                    id="passwordConfirm"
                    // disabled={isUpdating}
                    {...register("passwordConfirm")}
                />
            </FormRow>
            <FormRow>
                <Button
                    onClick={handleReset}
                    type="reset"
                    variation="secondary"
                >
                    Cancel
                </Button>
                <Button disabled={isUpdatingNewUser}>Update password</Button>
            </FormRow>
        </Form>
    );
}
