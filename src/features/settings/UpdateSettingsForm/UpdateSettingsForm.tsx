import Form from "../../../ui/Form/Form";
import { FormRow } from "../../../ui/FormRow/FormRow";
import Input from "../../../ui/Input/Input";
import Spinner from "../../../ui/Spinner/Spinner";
import {
    SanitizedSettingsData,
    sanitizeSettings,
} from "../../../utils/sanitizeSettings";
import { useSettings } from "../hooks/useSettings";
import { useUpdateSettings } from "../hooks/useUpdateSettings";
import { FocusEvent } from "react";

export type FormSettingsData = Partial<SanitizedSettingsData>;
export type UpdateSettingsKeys = keyof SanitizedSettingsData;

function UpdateSettingsForm() {
    const {
        isPending,

        // never destructuring an undefined or null possible nested value
        dataSettings,
    } = useSettings();

    // non nullable value and type safe from 'sanitizeSettings'
    const {
        maxBookingLength,
        maxNumberGuestsPerBooking,
        minBookingLength,
        breakfastPrice,
    } = sanitizeSettings(dataSettings);

    // destructuring isUpdating and updateSettings from useUpdateSettings hook
    // this will be used to update the settings when the form is submitted
    // this hook will return a function that can be called to update the settings
    const { isUpdating, updateSettings } = useUpdateSettings();

    const handleUpdate = (
        e: FocusEvent<HTMLInputElement>,
        key: UpdateSettingsKeys
    ): void => {
        const { value } = e.target;
        console.log(value);
        if (!value) return;
        updateSettings({ [key]: value });
    };

    // if no data is available, show a spinner
    if (isPending) return <Spinner />;
    return (
        <Form>
            <FormRow label={{ labelChild: "Minimum nights/booking" }}>
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={minBookingLength}
                    disabled={isUpdating}
                    onBlur={(e) => {
                        handleUpdate(e, "minBookingLength");
                    }}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Maximum nights/booking" }}>
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={maxBookingLength}
                    disabled={isUpdating}
                    onBlur={(e) => {
                        handleUpdate(e, "maxBookingLength");
                    }}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Maximum guests/booking" }}>
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={maxNumberGuestsPerBooking}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "maxNumberGuestsPerBooking")}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Breakfast price" }}>
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfastPrice}
                    disabled={isUpdating}
                    onBlur={(e) => handleUpdate(e, "breakfastPrice")}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
