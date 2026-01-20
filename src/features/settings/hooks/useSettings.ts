import { useQuery } from "@tanstack/react-query";
import { readSetting } from "../../../services/apiSettings";
import { Setting } from "../../../types/settings.type";

export const useSettings = () => {
    const {
        isPending: isSettingLoading,
        error,
        data,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: readSetting,
    });

    const setting = (data as Setting) ?? {
        id: 0,
        breakfastPrice: 0,
        maxBookingLength: 0,
        maxNumberGuestsPerBooking: 0,
        minBookingLength: 0,
    };

    console.log(setting);

    return { isSettingLoading, error, setting };
};
