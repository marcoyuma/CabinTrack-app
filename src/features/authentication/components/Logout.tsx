import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { ButtonIcon } from "../../../ui/ButtonIcon/ButtonIcon";
import { useLogout } from "../hooks/useLogout";
import { SpinnerMini } from "../../../ui/SpinnerMini/SpinnerMini";
import { MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
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
        <ButtonIcon onClick={handleSubmit} disabled={isLoggingOut}>
            {isLoggingOut ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
        </ButtonIcon>
    );
};
