import { useState } from "react";
import { Range } from "react-date-range";
import { Form } from "../../../../ui/Form/Form";
import { Input } from "../../../../ui/Input/Input";
import { FormRow } from "../../../../ui/FormRow/FormRow";
import { useCabins } from "../../../cabins/hooks/useCabins";
import { BookingCabinSelect } from "../BookingCabinSelect/BookingCabinSelect";
import { BookingDateRangePicker } from "../BookingDateRangePicker/BookingDateRangePicker";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../../../ui/Button/Button";
import {
    BookingFormDataType,
    bookingFormSchema,
} from "../../../../types/bookings.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../../../../ui/Checkbox/Checkbox";
import { formatCurrency } from "../../../../shared/utils/helpers";
import { useSettings } from "../../../settings/hooks/useSettings";
import { Textarea } from "../../../../ui/Textarea/Textarea";
import { useCreateGuest } from "../../../guests/hooks/useCreateGuest";
import { useCreateBooking } from "../../hooks/useCreateBooking";

interface CreateBookingFormProps {
    onCloseModal: () => void;
}
export function CreateBookingForm({ onCloseModal }: CreateBookingFormProps) {
    const { register, handleSubmit, formState, watch } =
        useForm<BookingFormDataType>({
            resolver: zodResolver(bookingFormSchema),
        });

    const { cabins } = useCabins();
    const [cabinId, setCabinId] = useState<number>();
    const cabin = cabins.find((val) => val.id === cabinId);
    console.log(cabin);

    const { isSettingLoading, errorSetting, setting } = useSettings();

    const { createGuest, isCreatingGuest } = useCreateGuest();
    const { createBooking, isCreatingBooking } = useCreateBooking();

    const [range, setRange] = useState<Range>({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const [hasBreakfast, setHasBreakfast] = useState(false);

    let numNights: number | null = null;
    if (range.startDate && range.endDate) {
        const diffTime = range.endDate.getTime() - range.startDate.getTime();
        console.log(diffTime);
        numNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const numGuests = Number(watch("numGuests") ?? 0);
    const optionalBreakfastPrice =
        numNights && setting
            ? setting.breakfastPrice * numNights * numGuests
            : 0;
    console.log(numNights);
    console.log(numGuests);
    console.log(optionalBreakfastPrice);

    console.log(`dateng: ${range.startDate}`);
    console.log(`pulang: ${range.endDate}`);

    const { errors } = formState;

    console.log(formState);

    const onSubmit: SubmitHandler<BookingFormDataType> = (data) => {
        if (!range.startDate || !range.endDate) {
            console.error("Please select date range");
            return;
        }

        if (!cabin) {
            console.log("ga");
            return;
        }

        // ! DATA BOOKINGS
        //   "startDate" timestamp without time zone null,
        //   "endDate" timestamp without time zone null,
        //   "numNights" smallint null,
        //   "numGuests" smallint null,
        //   "cabinPrice" real null,
        //   "extrasPrice" real null,
        //   "totalPrice" integer null,
        //   status text null,
        //   "hasBreakfast" boolean null,
        //   "isPaid" boolean null,
        //   observations text null,
        //   "cabinId" bigint null,
        //   "guestId" bigint null,
        //   constraint bookings_pkey primary key (id),
        //   constraint bookings_cabinId_fkey foreign KEY ("cabinId") references cabins (id),
        //   constraint bookings_guestId_fkey foreign KEY ("guestId") references guests (id)

        // * ALUR MEMBUAT BOOKINGS -> DALAM SATU SYNCHRONOUS OPERATION
        // 1. insert guest

        // 2. ambil guestId yang berhasil diinsert

        // 3. insert booking

        // type BookingFormDataType = {
        //     fullName: string;
        //     email: string;
        //     nationalID: string;
        //     nationality: string;
        //     countryFlag: string;
        //     numGuests: number;
        //     cabinId: number;
        //     hasBreakfast: boolean;
        //     isPaid: boolean;
        //     status: "unconfirmed" | "checked-in" | "checked-out";
        //     observations: string | null;
        // };
        const guestPayload: {
            fullName: string | null;
            email: string | null;
            nationalID: string | null;
            nationality: string | null;
            countryFlag: string | null;
        } = {
            fullName: data.fullName,
            email: data.email,
            nationality: data.nationality,
            nationalID: null,
            countryFlag: null,
        };

        createGuest(guestPayload, {
            onSuccess: (data) => {
                console.log(data);
            },
        });

        if (isCreatingGuest) {
            console.log("lagi loading");
        }

        const payload: {
            cabinId?: number | null;
            cabinPrice?: number | null;
            endDate?: string | null;
            extrasPrice?: number | null;
            guestId?: number | null;
            hasBreakfast?: boolean | null;
            isPaid?: boolean | null;
            numGuests?: number | null;
            numNights?: number | null;
            observations?: string | null;
            startDate?: string | null;
            status?: string | null;
            totalPrice?: number | null;
        } = {
            startDate: range.startDate.toISOString(),
            endDate: range.endDate.toISOString(),
            // fullName: data.fullName,
            // nationality: data.nationality,
            numNights,
            numGuests,
            cabinPrice: cabin.regularPrice,
            extrasPrice: optionalBreakfastPrice,
            totalPrice: cabin.regularPrice + optionalBreakfastPrice,
            status: "unconfirmed",
            hasBreakfast,
            isPaid: false,
            observations: data.observations,
            cabinId,
        };

        createBooking(payload, {
            onSuccess: (data) => {
                console.log(data);
            },
        });

        console.log(payload);
    };

    return (
        <Form
            id="createBooking"
            name="createBooking"
            type="modal"
            onSubmit={handleSubmit(onSubmit)}
        >
            <FormRow
                label="Full name"
                htmlFor="fullName"
                error={errors.fullName?.message}
            >
                <Input type="text" id="fullName" {...register("fullName")} />
            </FormRow>
            <FormRow
                label="Email"
                htmlFor="email"
                error={errors.email?.message}
            >
                <Input type="text" id="email" {...register("email")} />
            </FormRow>
            <FormRow
                label="Nationality"
                htmlFor="nationality"
                error={errors.nationality?.message}
            >
                <Input
                    type="text"
                    id="nationality"
                    {...register("nationality")}
                />
            </FormRow>
            <FormRow
                label="Guests"
                htmlFor="numGuests"
                error={errors.numGuests?.message}
            >
                <Input type="text" id="numGuests" {...register("numGuests")} />
            </FormRow>
            <FormRow
                label="Observations"
                htmlFor="observations"
                error={errors.observations?.message}
            >
                <Textarea id="observations" {...register("observations")} />
            </FormRow>
            <FormRow label="Check-in & Check-out Dates" htmlFor="dateRange">
                {/* <DateRangePicker size="lg" placeholder="Select stay date" /> */}
                <BookingDateRangePicker range={range} setRange={setRange} />
            </FormRow>
            <FormRow
                label="Select cabin"
                htmlFor="cabin"
                // error={errors.cabinId?.message}
            >
                {/* <Input type="" id="cabin"  
                // {...register("")}
                 /> */}
                <BookingCabinSelect
                    // {...register("cabinId")}
                    cabins={cabins}
                    cabinId={cabinId}
                    setCabinId={setCabinId}
                />
            </FormRow>
            <FormRow label="Optional breakfast">
                <Checkbox
                    checked={hasBreakfast}
                    onChange={() => setHasBreakfast((prev) => !prev)}
                    id="hasBreakfast"
                    // {...register("hasBreakfast")}
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
