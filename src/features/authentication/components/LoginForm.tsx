import { FormEvent, useState } from "react";
import { Form } from "../../../ui/Form/Form";
import { Input } from "../../../ui/Input/Input";
import { Button } from "../../../ui/Button/Button";
import { FormRowVertical } from "../../../ui/FormRowVertical/FormRowVertical";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";

export const LoginForm = () => {
    const [email, setEmail] = useState("marco@gmail.com");
    const [password, setPassword] = useState("Marco123");

    const navigate = useNavigate();

    const { login, isLoggingIn } = useLogin();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) return;

        login(
            { email, password },
            {
                onError: () => {
                    setEmail("");
                    setPassword("");
                },

                onSettled: () => {
                    navigate("/dashboard", { replace: true });
                },
            }
        );

        console.log("diteken");
    }

    return (
        <Form onSubmit={handleSubmit} id="login" name="login">
            <FormRowVertical label="Email address" orientation="vertical">
                <Input
                    type="email"
                    id="email"
                    // This makes this form better for password managers
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical label="Password" orientation="vertical">
                <Input
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                />
            </FormRowVertical>
            <FormRowVertical orientation="vertical">
                <Button size="large" disabled={isLoggingIn}>
                    {!isLoggingIn ? "Login" : <SpinnerMini />}
                </Button>
            </FormRowVertical>
        </Form>
    );
};
