import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useIsStaff } from "../../features/stays/hooks/useIsStaff";
import { Spinner } from "../Spinner/Spinner";

const FullPage = styled.div`
    height: 100vh;
    background-color: var(--color-grey-50);
    display: flex;
    align-items: center;
    justify-content: center;
`;

// Parallel to ProtectedRoute (which gates authenticated-vs-not), this gates staff-only pages —
// currently /stays, which is also where villas are created and edited (both are modals on that
// page, not routes of their own). Not the actual security boundary (the RLS policies in
// 0016_admin_staff_catalog_writes.sql are), just UX so a non-staff account never lands on a
// form it can't submit.
export function StaffOnlyRoute({ children }: { children: ReactNode }) {
    const { isStaff, isLoading } = useIsStaff();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isStaff) {
            navigate("/dashboard");
        }
    }, [isLoading, isStaff, navigate]);

    if (isLoading)
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );

    if (isStaff) return children;

    return null;
}
