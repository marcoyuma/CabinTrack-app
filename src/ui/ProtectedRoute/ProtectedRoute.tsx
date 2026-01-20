import { ReactNode, useEffect } from "react";
import { useUser } from "../../features/authentication/hooks/useUser";
import { Spinner } from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    // get the authenticated user
    const { isUserLoading, isAuthenticated, user } = useUser();
    console.log(isAuthenticated);
    console.log(isUserLoading);

    //  programmatically navigate hook
    const navigate = useNavigate();

    // redirect to /login if there's no authenticated user
    useEffect(() => {
        if (!isAuthenticated && !isUserLoading) {
            navigate("/login");
            console.log("balik ke login");
        }
    }, [isAuthenticated, isUserLoading, navigate]);

    // show spinner while loading
    if (isUserLoading)
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );

    // render app
    if (isAuthenticated && user) return children;
};
