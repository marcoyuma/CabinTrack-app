import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../services/fetchCurrentUser";

export const useUser = () => {
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["user"],
        queryFn: fetchCurrentUser,
    });
    console.log(`user di useUser: ${user}`);
    console.log(`user role di useUser: ${user?.role}`);
    console.log(`user loading di useUser: ${isUserLoading}`);

    return {
        user,
        isUserLoading,
        isAuthenticated: user?.role === "authenticated",
    };
};
