import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../ui/Button/Button";
import { Form } from "../../../ui/Form/Form";
import { FormRow } from "../../../ui/FormRow/FormRow";
import { Input } from "../../../ui/Input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    signupFormSchema,
    SignupFormSchema,
} from "../types/auth.signupForm.schema";
import { useSignup } from "../hooks/useSignup";

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: zodResolver(signupFormSchema) });

    const { signup, isSigningUp } = useSignup();

    const onSubmit: SubmitHandler<SignupFormSchema> = ({
        fullName,
        email,
        password,
    }) => {
        console.log(`signup: 
            fullName: ${fullName}, 
            email:    ${email},
            password: ${password}`);
        signup(
            {
                fullName: fullName,
                email: email,
                password: password,
            },
            {
                onSettled: () => {
                    reset();
                },
            }
        );
    };
    const onError = (e: FieldErrors) => {
        console.error(e);
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="Full name" error={errors.fullName?.message}>
                <Input
                    disabled={isSigningUp}
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                />
            </FormRow>
            <FormRow label="Email address" error={errors.email?.message}>
                <Input
                    disabled={isSigningUp}
                    type="email"
                    id="email"
                    {...register("email")}
                />
            </FormRow>
            <FormRow
                label="Password (min 8 characters)"
                error={errors.password?.message}
            >
                <Input
                    disabled={isSigningUp}
                    type="password"
                    id="password"
                    {...register("password")}
                />
            </FormRow>
            <FormRow
                label="Repeat password"
                error={errors.passwordConfirm?.message}
            >
                <Input
                    disabled={isSigningUp}
                    type="password"
                    id="passwordConfirm"
                    {...register("passwordConfirm")}
                />
            </FormRow>
            <FormRow>
                {/* type is an HTML attribute! */}
                <Button variation="secondary" type="reset">
                    Cancel
                </Button>
                <Button>Create new user</Button>
            </FormRow>
        </Form>
    );
}

export default SignupForm;
