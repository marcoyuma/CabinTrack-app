import Form from "../../../ui/Form/Form";
import { FormRow } from "../../../ui/FormRow/FormRow";
import Input from "../../../ui/Input/Input";
import Spinner from "../../../ui/Spinner/Spinner";
import { sanitizeSettings } from "../../../utils/sanitizeSettings";
import { useSettings } from "../hooks/useSettings";

function UpdateSettingsForm() {
    const {
        isPending,

        // never destructuring an undefined or null possible nested value
        dataSettings,
    } = useSettings();

    // take value returned
    const {
        maxBookingLength,
        maxNumberGuestsPerBooking,
        minBookingLength,
        breakfastPrice,
    } = sanitizeSettings(dataSettings);

    if (isPending) return <Spinner />;
    return (
        <Form>
            <FormRow label={{ labelChild: "Minimum nights/booking" }}>
                <Input
                    type="number"
                    id="min-nights"
                    defaultValue={minBookingLength ?? 0}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Maximum nights/booking" }}>
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={maxBookingLength ?? 0}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Maximum guests/booking" }}>
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={maxNumberGuestsPerBooking ?? 0}
                />
            </FormRow>
            <FormRow label={{ labelChild: "Breakfast price" }}>
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfastPrice ?? 0}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
