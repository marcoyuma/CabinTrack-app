import { Button } from "../../../ui/Button/Button";
import { useLogout } from "../hooks/useLogout";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
    const { logout, isLoggingOut } = useLogout();

    const navigate = useNavigate();

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = () => {
        // 'undefined' is passed because the logout mutation function does not require any parameters
        logout(undefined, {
            onSuccess: () => {
                navigate("/login", { replace: true });
            },
        });
    };

    return (
        <Button variation="danger" onClick={handleSubmit} disabled={isLoggingOut}>
            {isLoggingOut ? <SpinnerMini /> : "Log out"}
        </Button>
    );
}
