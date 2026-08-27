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
    gap: 2.4rem;
    padding: 2rem;
    background-color: var(--color-grey-100);

    ${media.tablet(css`
        grid-template-columns: 48rem;
        gap: 3.2rem;
        padding: 2rem 0;
    `)}
`;

// Logo, title and tagline read as one block, so they sit closer to each other than the
// grid gap that separates them from the form card.
const Branding = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
`;

// Logo itself is left-aligned because the Header depends on that — centering is the
// login page's job.
const LogoWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Tagline = styled.p`
    font-size: var(--font-size-body);
    color: var(--color-grey-500);
    text-align: center;
`;

export function Login() {
    return (
        <LoginLayout>
            <Branding>
                <LogoWrapper>
                    <Logo />
                </LogoWrapper>
                <Heading as="h4">Log in to your account</Heading>
                <Tagline>Seaspace villa admin panel</Tagline>
            </Branding>
            <LoginForm />
        </LoginLayout>
    );
}
