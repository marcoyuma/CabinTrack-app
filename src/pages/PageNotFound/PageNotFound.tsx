import styled, { css } from "styled-components";
import { Heading } from "../../ui/Heading/Heading";

import { useMoveBack } from "../../hooks/useMoveBack";
import { Button } from "../../ui/Button/Button";
import { media } from "../../styles/breakpoints";

const StyledPageNotFound = styled.main`
    min-height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;

    ${media.tablet(css`
        padding: 4.8rem;
    `)}
`;

const Box = styled.div`
    /* box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: var(--spacing-card-padding);
    flex: 0 1 96rem;
    text-align: center;

    & h1 {
        margin-bottom: 3.2rem;
    }
`;

export function PageNotFound() {
    const moveBack = useMoveBack();

    return (
        <StyledPageNotFound>
            <Box>
                <Heading as="h1">
                    The page you are looking for could not be found 😢
                </Heading>
                <Button onClick={moveBack} size="large">
                    &larr; Go back
                </Button>
            </Box>
        </StyledPageNotFound>
    );
}
