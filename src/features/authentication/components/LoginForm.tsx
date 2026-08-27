import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

import { Form } from "../../../ui/Form/Form";
import { Input } from "../../../ui/Input/Input";
import { Button } from "../../../ui/Button/Button";
import { FormRowVertical } from "../../../ui/FormRowVertical/FormRowVertical";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";
import { media } from "../../../styles/breakpoints";
import { useLogin } from "../hooks/useLogin";
import {
    loginFormSchema,
    LoginFormSchema,
} from "../types/auth.loginForm.schema";

// The shared Form is a 12px-radius card with no shadow; the login card is the only card
// on its page, so it borrows the dashboard card language (20px + lift) instead.
// `overflow: hidden` is undone so the input focus ring isn't clipped at the card edge.
const LoginCard = styled(Form)`
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    overflow: visible;

    ${media.tablet(css`
        padding: 3.2rem 4rem;
    `)}
`;

const inputStyles = css`
    width: 100%;
    font-size: var(--font-size-body);
    padding: 1rem 1.2rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: var(--color-brand-600);
        box-shadow: 0 0 0 3px var(--color-brand-100);
    }
`;

const StyledInput = styled(Input)`
    ${inputStyles}
`;

// Extra right padding keeps the typed password clear of the reveal button.
const PasswordInput = styled(Input)`
    ${inputStyles}
    padding-right: 4rem;
`;

const PasswordField = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const TogglePasswordButton = styled.button`
    position: absolute;
    right: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    border: none;
    border-radius: var(--border-radius-sm);
    background: none;
    color: var(--color-grey-400);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        color: var(--color-brand-600);
        background-color: var(--color-brand-50);
    }

    & svg {
        width: 1.8rem;
        height: 1.8rem;
    }
`;

const SubmitButton = styled(Button)`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    transition: all 0.3s;
`;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login, isLoggingIn } = useLogin();

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors },
    } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "staf1@example.com",
            password: "staf1",
        },
    });

    const onSubmit: SubmitHandler<LoginFormSchema> = ({ email, password }) => {
        login(
            { email, password },
            {
                onSuccess: () => {
                    navigate("/dashboard", { replace: true });
                },

                // Only the password is cleared — retyping a correct email after a typo in
                // the password is needless friction. useLogin already shows the toast.
                onError: () => {
                    resetField("password");
                },
            },
        );
    };

    return (
        <LoginCard onSubmit={handleSubmit(onSubmit)} id="login" name="login">
            <FormRowVertical
                label="Email address"
                htmlFor="email"
                error={errors.email?.message}
            >
                <StyledInput
                    type="email"
                    id="email"
                    // This makes this form better for password managers
                    autoComplete="username"
                    disabled={isLoggingIn}
                    {...register("email")}
                />
            </FormRowVertical>

            <FormRowVertical
                label="Password"
                htmlFor="password"
                error={errors.password?.message}
            >
                <PasswordField>
                    <PasswordInput
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        disabled={isLoggingIn}
                        {...register("password")}
                    />
                    <TogglePasswordButton
                        type="button"
                        onClick={() => setShowPassword((show) => !show)}
                        aria-label={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                    </TogglePasswordButton>
                </PasswordField>
            </FormRowVertical>

            <FormRowVertical>
                <SubmitButton size="large" disabled={isLoggingIn}>
                    {!isLoggingIn ? "Login" : <SpinnerMini />}
                </SubmitButton>
            </FormRowVertical>
        </LoginCard>
    );
}
