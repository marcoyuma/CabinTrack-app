import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../../services/apiSettings";

export const useSettings = () => {
    const {
        isPending,
        error,
        data: dataSettings,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });
    return { isPending, error, dataSettings };
};
