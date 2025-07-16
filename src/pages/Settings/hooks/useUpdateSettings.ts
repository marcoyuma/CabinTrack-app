import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../../services/apiSettings";
import { FormSettingsData } from "../UpdateSettingsForm/UpdateSettingsForm";

export const useUpdateSettings = () => {
    // define client for invalidate the new data
    // this will allow us to invalidate the query and refetch the data after mutation
    // this is necessary to keep the UI in sync with the latest data from the server
    const queryClient = useQueryClient();
    const {
        // status information returned while mutating or end mutating. named as 'isUpdating'
        isPending: isUpdating,
        // mutation function returned and renamed as 'updateSettings' to trigger the actual mutation input data and call the callback function 'updateSettings'
        mutate: updateSettings,
    } = useMutation({
        // mutation function defined in '../../../services/apiSettings.ts'
        mutationFn: (newSettingsData: FormSettingsData) =>
            updateSettingApi(newSettingsData),
        // when mutation is success then invalidate the query and force it to be stale, this will automatically re-fetch data from server so the UI will stay in sync with updated 'settings' query data.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Settings updated successfully");
        },
        // when error logic
        onError: (err) => toast.error(err.message),
    });
    return { isUpdating, updateSettings };
};
