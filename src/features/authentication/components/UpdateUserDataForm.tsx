import { useUser } from "../hooks/useUser";
import { UpdateUserDataFormInner } from "./UpdateUserDataFormInner";

export function UpdateUserDataForm() {
    const { user } = useUser();

    if (!user) return null;

    return <UpdateUserDataFormInner user={user} />;
}
