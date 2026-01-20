import supabase from "../supabase/supabase";
import { readSettingsSchema, Setting } from "../types/settings.type";

export async function readSetting() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

    if (error) {
        console.error(error);
        throw new Error("server error, settings could not be loaded");
    }

    const setting = readSettingsSchema.parse(data);

    return setting;
}

// We expect a newSetting object that looks like {setting: newValue}
// type for newSetting
// export type NewSetting = {
//     [K in keyof SanitizedSettingsData]?: SanitizedSettingsData[K];
// };
// export type NewSetting = SanitizedSettingsData;
export async function updateSetting(newSetting: Setting /* NewSetting */) {
    console.log(newSetting);

    const { data, error } = await supabase
        .from("settings")
        .update({ ...newSetting })
        // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
        .eq("id", 1)
        .single();

    console.log(data);

    if (error) {
        console.error(error);
        throw new Error(`server error, settings could not be updated`);
    }

    return data;
}
