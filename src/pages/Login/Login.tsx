import styled, { css } from "styled-components";

import { Logo } from "../../ui/Logo/Logo";
import { Heading } from "../../ui/Heading/Heading";
import { LoginForm } from "../../features/authentication/components/LoginForm";
import { media } from "../../styles/breakpoints";

// Fixed 48rem (=480px) column has no fallback below that width — fluid + padding at mobile,
// pinned back to the original 48rem once there's room for it.
const LoginLayout = styled.main`
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 40rem);
    align-content: center;
    justify-content: center;
    gap: 2rem;
    padding: 2rem;
    background-color: var(--color-grey-50);

    ${media.tablet(css`
        grid-template-columns: 48rem;
        gap: 3.2rem;
        padding: 0;
    `)}
`;

export function Login() {
    return (
        <LoginLayout>
            <Logo />
            <Heading as="h4">Log in to your account</Heading>
            <LoginForm />
        </LoginLayout>
    );
}
