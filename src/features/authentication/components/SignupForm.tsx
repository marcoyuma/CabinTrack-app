import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../ui/Button/Button";
import { Form } from "../../../ui/Form/Form";
import { FormRow } from "../../../ui/FormRow/FormRow";
import { Input } from "../../../ui/Input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupFormSchema, SignupSchemaType } from "../types/auth.schema";
import { useSignup } from "../hooks/useSignUp";
import { Spinner } from "../../../ui/Spinner/Spinner";

function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(signupFormSchema) });

    const { signup, isSigningUp } = useSignup();

    const onSubmit: SubmitHandler<SignupSchemaType> = (data) => {
        console.log(data);

        console.log(`signup: ${data}`);
        signup({ email: data.email, password: data.password });
    };
    const onError = (e: FieldErrors) => {
        console.error(e);
    };

    if (isSigningUp) return <Spinner />;

    return (
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormRow label="Full name" error={errors.fullName?.message}>
                <Input type="text" id="fullName" {...register("fullName")} />
            </FormRow>
            <FormRow label="Email address" error={errors.email?.message}>
                <Input type="email" id="email" {...register("email")} />
            </FormRow>
            <FormRow
                label="Password (min 8 characters)"
                error={errors.password?.message}
            >
                <Input
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
