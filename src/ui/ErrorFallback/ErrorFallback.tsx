import styled from "styled-components";
import { Heading } from "../Heading/Heading";
import { Button } from "../Button/Button";
import { useRouteError } from "react-router-dom";

const StyledErrorFallback = styled.main`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4.8rem;
`;

const Box = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 4.8rem;
    flex: 0 1 96rem;
    text-align: center;

    & h1 {
        margin-bottom: 1.6rem;
    }

    & p {
        font-family: "Sono";
        margin-bottom: 3.2rem;
        color: var(--color-grey-500);
    }
`;

type ErrorFallbackProps = {
    error?: Error | null;
    resetErrorBoundary?: () => void;
};

/**
 * Provides a graceful error screen with retry or navigation options when something breaks
 */
export function ErrorFallback({
    error: boundaryError,
    resetErrorBoundary,
}: ErrorFallbackProps) {
    const routeError = useRouteError();

    const error =
        boundaryError ?? (routeError instanceof Error ? routeError : null);

    console.error(error);

    return (
        <>
            <StyledErrorFallback>
                <Box>
                    <Heading as="h1">Something went wrong</Heading>
                    <p>{error?.message ?? "Unknown error occurred"}</p>

                    {resetErrorBoundary ? (
                        <Button onClick={resetErrorBoundary}>Try again</Button>
                    ) : (
                        <Button onClick={() => window.location.replace("/")}>
                            Go to dashboard
                        </Button>
                    )}
                </Box>
            </StyledErrorFallback>
        </>
    );
}
