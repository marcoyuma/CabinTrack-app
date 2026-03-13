import { useEffect, useState } from "react";

import { Form } from "../../../../ui/Form/Form";
import { Input } from "../../../../ui/Input/Input";
import { FormRow } from "../../../../ui/FormRow/FormRow";
import { BookingCabinSelect } from "../BookingCabinSelect/BookingCabinSelect";
import { BookingDateRangePicker } from "../BookingDateRangePicker/BookingDateRangePicker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../../ui/Button/Button";
import {
    BookingFormDataType,
    BookingFormInputType,
    bookingFormSchema,
    createBookingPayloadSchema,
    CreateBookingPayloadType,
} from "../../../../types/bookings.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../../../../ui/Checkbox/Checkbox";
import { formatCurrency } from "../../../../shared/utils/helpers";
import { useSettings } from "../../../settings/hooks/useSettings";
import { Textarea } from "../../../../ui/Textarea/Textarea";
import { useCreateGuest } from "../../../guests/hooks/useCreateGuest";
import { useCreateBooking } from "../../hooks/useCreateBooking";
import { format } from "date-fns";
import { generateUniqueNumber } from "../../../../shared/utils/uniqueNumber";
import { NationalitySelect } from "../NationalitySelect/NationalitySelect";
import { useFlags } from "../../hooks/useFlags";
import { useSelectableCabins } from "../../hooks/useSelectableCabins";
import { Guest } from "../../../../types/guests.type";

interface CreateBookingFormProps {
    onCloseModal: () => void;
}

/**
 * CreateBookingForm collects guest + booking details in a single UI flow.
 *
 * On submit it creates the guest first (to obtain `guestId`), then creates the booking
 * using the selected cabin, date range, and optional breakfast pricing.
 */
export function CreateBookingForm({ onCloseModal }: CreateBookingFormProps) {
    const flagOptions = useFlags();
    const [countryCode, setCountryCode] = useState("");
    const flags = flagOptions.find((val) => val.value === countryCode.trim());

    const nationalID = generateUniqueNumber();

    const { register, handleSubmit, formState, watch, setValue, control } =
        useForm<BookingFormInputType, unknown, BookingFormDataType>({
            resolver: zodResolver(bookingFormSchema),
            defaultValues: {
                dateRange: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: "selection",
                },
                cabinId: 0,
                nationality: "",
                hasBreakfast: false,
            },
        });
    const { errors } = formState;

    useEffect(() => {
        register("nationality");
    }, [register]);

    const { isSettingLoading, setting } = useSettings();
    const { createGuest, isCreatingGuest } = useCreateGuest();
    const { createBooking, isCreatingBooking } = useCreateBooking();

    const cabinId = watch("cabinId");
    const endDate = watch("dateRange.endDate");
    const startDate = watch("dateRange.startDate");
    const numGuests = Number(watch("numGuests") ?? 0);
    const hasBreakfast = Boolean(watch("hasBreakfast"));

    const { selectableCabins, isSelectingCabins } = useSelectableCabins({
        checkIn: startDate ? `${format(startDate, "yyyy-MM-dd")}` : "",
        checkOut: endDate ? `${format(endDate, "yyyy-MM-dd")}` : "",
        guests: Number(watch("numGuests")),
    });

    const cabins = selectableCabins ?? [];
    const cabin = cabins.find((val) => val.id === cabinId);

    let numNights: number | null = null;
    if (startDate && endDate) {
        const diffTime = endDate.getTime() - startDate.getTime();
        numNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const optionalBreakfastPrice =
        numNights && setting
            ? setting.breakfastPrice * numNights * numGuests
            : 0;

    const onSubmit: SubmitHandler<BookingFormDataType> = (data) => {
        if (!cabin) {
            return;
        }
        if (numNights === null) {
            return;
        }

        // createGuest payload for creating guest
        const guestPayload: Omit<Guest, "created_at" | "id"> = {
            fullName: data.fullName,
            email: data.email,
            nationality: flags ? flags.label : "🇺🇳",
            nationalID: nationalID,
            countryFlag: `https://flagcdn.com/${data.nationality}.svg`,
        };

        // booking data
        const bookingPayload: Omit<CreateBookingPayloadType, "guestId"> = {
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            numNights,
            numGuests,
            cabinPrice: cabin.regularPrice,
            extrasPrice: optionalBreakfastPrice,
            totalPrice: cabin.regularPrice + optionalBreakfastPrice,
            status: "unconfirmed",
            hasBreakfast: data.hasBreakfast,
            isPaid: false,
            observations: data.observations ?? "",
            cabinId,
        };

        // Create guest first, then create booking using the returned guestId.
        createGuest(guestPayload, {
            onSuccess: (data) => {
                const payload = createBookingPayloadSchema.parse({
                    ...bookingPayload,
                    guestId: data[0].id,
                });
                createBooking(payload, {
                    onSuccess: () => {
                        onCloseModal();
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                });
            },
            onError: (err) => {
                console.error(err);
            },
        });
    };

    // set boolean value to set either date or numGuests condition is true
    const invalidDateAndNumGuests =
        startDate?.getDate() === endDate?.getDate() || numGuests === 0;

    /**
     * Syncs nationality selection between local `countryCode` state and RHF `nationality`
     * field so validation and submit payload always use the latest selected country code.
     *
     * @param e - Native `<select>` change event; reads `e.target.value` as the next
     * country code and applies it to both local state and form state.
     */
    const handleNationalitySelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextCountryCode = e.target.value;
        // setNationality(flags[nextCountryCode]);
        setCountryCode(nextCountryCode);
        setValue("nationality", nextCountryCode, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const isLoading =
        isSettingLoading ||
        isCreatingBooking ||
        isCreatingGuest ||
        isSelectingCabins;

    return (
        <Form
            id="createBooking"
            name="createBooking"
            type="modal"
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormRow
                label="Check-in & Check-out Dates"
                htmlFor="dateRange"
                // error={customErrors.dateRange}
                error={errors.dateRange?.message}
            >
                <Controller
                    name="dateRange"
                    control={control}
                    render={({ field }) => {
                        return (
                            <BookingDateRangePicker
                                // range={range}
                                // setRange={handleRangeChange}
                                range={field.value}
                                setRange={field.onChange}
                            />
                        );
                    }}
                />
            </FormRow>

            <FormRow
                label="Guests"
                htmlFor="numGuests"
                error={errors.numGuests?.message}
            >
                <Input
                    type="number"
                    id="numGuests"
                    disabled={isLoading}
                    {...register("numGuests")}
                />
            </FormRow>
            <FormRow
                label="Select cabin"
                htmlFor="cabin"
                error={errors.cabinId?.message}
            >
                <Controller
                    name="cabinId"
                    control={control}
                    render={({ field }) => (
                        <BookingCabinSelect
                            disabled={invalidDateAndNumGuests || isLoading}
                            cabins={cabins}
                            cabinId={field.value}
                            setCabinId={field.onChange}
                        />
                    )}
                />
            </FormRow>
            <FormRow
                label="Full name"
                htmlFor="fullName"
                error={errors.fullName?.message}
            >
                <Input
                    type="text"
                    id="fullName"
                    disabled={isLoading}
                    {...register("fullName")}
                />
            </FormRow>
            <FormRow
                label="Email"
                htmlFor="email"
                error={errors.email?.message}
            >
                <Input
                    type="text"
                    id="email"
                    disabled={isLoading}
                    {...register("email")}
                />
            </FormRow>
            <FormRow
                label="Nationality"
                htmlFor="nationality"
                error={errors.nationality?.message}
            >
                {/* Calls handleNationalitySelectChange to sync local select UI + RHF value. */}
                <NationalitySelect
                    value={countryCode}
                    options={flagOptions}
                    onChange={handleNationalitySelectChange}
                />
            </FormRow>
            <FormRow
                label="Observations"
                htmlFor="observations"
                error={errors.observations?.message}
            >
                <Textarea
                    id="observations"
                    {...register("observations")}
                    disabled={isLoading}
                />
            </FormRow>

            <FormRow label="Optional breakfast" htmlFor="hasBreakfast">
                <Checkbox
                    disabled={invalidDateAndNumGuests || isLoading}
                    checked={hasBreakfast}
                    id="hasBreakfast"
                    {...register("hasBreakfast")}
                >
                    Add breakfast for {formatCurrency(optionalBreakfastPrice)}?
                </Checkbox>
            </FormRow>
            <FormRow actions>
                <Button>Submit</Button>
            </FormRow>
        </Form>
    );
}
