import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { Button } from "../../../ui/Button/Button";

import { stayEditSchema, StayEditFormValues, StayEditInput } from "../types/stay-edit.schema";
import { Stay } from "../types/stay.schema";
import { useUpdateStay } from "../hooks/useUpdateStay";
import { StayLocationPicker } from "./StayLocationPicker";
import {
    ErrorText,
    Field,
    Footer,
    FormShell,
    Grid,
    Hint,
    Label,
    SectionLabel,
    Subtitle,
    TextArea,
    TextInput,
    Title,
} from "./StayFormLayout";

interface EditStayFormProps {
    stay: Stay;
    featuredCount: number;
    onClose: () => void;
}

/**
 * Edit form rendered as modal content (opened from the table's pencil action).
 *
 * Scope: the `stays` columns only. `slug` is read-only — renaming it changes a published,
 * possibly search-indexed public URL (see STAYS-INPUT-DECISIONS.md). Photos and amenities
 * aren't re-managed here; see STAYS-TABLE-DECISIONS.md for that open item.
 *
 * The `is_new`/`is_featured` flags live here rather than as inline table toggles, so the
 * "only two villas may be featured" rule is enforced at the one place flags are edited.
 */
export function EditStayForm({ stay, featuredCount, onClose }: EditStayFormProps) {
    const { editStay, isUpdatingStay } = useUpdateStay();

    // No DB constraint enforces this — the customer landing page is simply built for exactly
    // two featured cards (ADMIN-PANEL-CONTEXT2.md). Turning featured OFF is always allowed, so
    // staff can never get stuck unable to leave the featured state.
    const featuredCapReached = featuredCount >= 2 && !stay.is_featured;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StayEditFormValues, unknown, StayEditInput>({
        resolver: zodResolver(stayEditSchema),
        // See CreateStayForm.tsx: "onBlur" surfaces the error popup as soon as a field is left
        // invalid, instead of staying silent until a submit attempt.
        mode: "onBlur",
        defaultValues: {
            name: stay.name,
            location: stay.location,
            price_per_night: stay.price_per_night,
            discount: stay.discount,
            capacity: stay.capacity,
            beds: stay.beds,
            area: stay.area,
            is_new: stay.is_new,
            is_featured: stay.is_featured,
            description: stay.description,
            lat: stay.lat,
            lng: stay.lng,
        },
    });

    const lat = watch("lat");
    const lng = watch("lng");

    const onSubmit: SubmitHandler<StayEditInput> = (data) => {
        editStay({ id: stay.id, payload: data }, { onSuccess: onClose });
    };

    return (
        <FormShell
            // See CreateStayForm.tsx: without this the browser's own constraint-validation
            // bubble fires alongside `ErrorText`'s popup, in a mismatched default style.
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >
            <Title>Edit villa</Title>
            <Subtitle>{stay.name}</Subtitle>

            <Grid>
                <Field>
                    <Label htmlFor="name">Name</Label>
                    <TextInput
                        id="name"
                        type="text"
                        $hasError={!!errors.name}
                        {...register("name")}
                    />
                    {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
                </Field>

                <Field>
                    <Label htmlFor="slug">Slug</Label>
                    <TextInput id="slug" type="text" value={stay.slug} disabled readOnly />
                    <Hint>Locked after publishing — this is the public URL.</Hint>
                </Field>

                <Field $full>
                    <Label htmlFor="location">Location</Label>
                    <TextInput
                        id="location"
                        type="text"
                        placeholder="Canggu, Bali"
                        $hasError={!!errors.location}
                        {...register("location")}
                    />
                    <Hint>Must keep the "District, Bali" comma format.</Hint>
                    {errors.location && <ErrorText>{errors.location.message}</ErrorText>}
                </Field>

                <Field>
                    <Label htmlFor="price_per_night">Price per night (Rp)</Label>
                    <TextInput
                        id="price_per_night"
                        type="number"
                        min={1}
                        max={1_000_000_000}
                        step={1}
                        $hasError={!!errors.price_per_night}
                        {...register("price_per_night", { valueAsNumber: true })}
                    />
                    {errors.price_per_night && (
                        <ErrorText>{errors.price_per_night.message}</ErrorText>
                    )}
                </Field>

                <Field>
                    <Label htmlFor="discount">Discount (Rp)</Label>
                    <TextInput
                        id="discount"
                        type="number"
                        min={0}
                        max={1_000_000_000}
                        step={1}
                        $hasError={!!errors.discount}
                        {...register("discount", { valueAsNumber: true })}
                    />
                    {errors.discount && <ErrorText>{errors.discount.message}</ErrorText>}
                </Field>

                <SectionLabel>Specs</SectionLabel>

                <Field>
                    <Label htmlFor="capacity">Capacity (guests)</Label>
                    <TextInput
                        id="capacity"
                        type="number"
                        min={1}
                        max={32_767}
                        step={1}
                        $hasError={!!errors.capacity}
                        {...register("capacity", { valueAsNumber: true })}
                    />
                    {errors.capacity && <ErrorText>{errors.capacity.message}</ErrorText>}
                </Field>

                <Field>
                    <Label htmlFor="beds">Beds</Label>
                    <TextInput
                        id="beds"
                        type="number"
                        min={1}
                        max={32_767}
                        step={1}
                        $hasError={!!errors.beds}
                        {...register("beds", { valueAsNumber: true })}
                    />
                    {errors.beds && <ErrorText>{errors.beds.message}</ErrorText>}
                </Field>

                <Field>
                    <Label htmlFor="area">Area (m²)</Label>
                    <TextInput
                        id="area"
                        type="number"
                        min={1}
                        max={32_767}
                        step={1}
                        $hasError={!!errors.area}
                        {...register("area", { valueAsNumber: true })}
                    />
                    {errors.area && <ErrorText>{errors.area.message}</ErrorText>}
                </Field>

                <SectionLabel>Map position</SectionLabel>

                <Field $full>
                    {/* lat/lng stay registered so zod still validates them and RHF still owns
                        the values; the picker is just the input device. Editing already has
                        coordinates, so the map opens on the villa rather than empty. */}
                    <input type="hidden" {...register("lat", { valueAsNumber: true })} />
                    <input type="hidden" {...register("lng", { valueAsNumber: true })} />
                    <StayLocationPicker
                        lat={lat}
                        lng={lng}
                        onCoordinatesChange={(newLat, newLng) => {
                            setValue("lat", newLat, { shouldValidate: true });
                            setValue("lng", newLng, { shouldValidate: true });
                        }}
                        // The edit form leaves `location` alone: it is already set and correct,
                        // and quietly re-deriving it from a geocoder result is exactly the kind
                        // of silent overwrite decision 2 was written to avoid.
                        onLocationSuggest={() => {}}
                        error={errors.lat?.message ?? errors.lng?.message}
                    />
                </Field>

                <Field $full>
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                        id="description"
                        $hasError={!!errors.description}
                        {...register("description")}
                    />
                    {errors.description && (
                        <ErrorText>{errors.description.message}</ErrorText>
                    )}
                </Field>

                <SectionLabel>Flags</SectionLabel>

                <Field>
                    <Checkbox id="is_new" {...register("is_new")}>
                        Show "New" badge
                    </Checkbox>
                </Field>

                <Field>
                    <Checkbox
                        id="is_featured"
                        disabled={featuredCapReached}
                        {...register("is_featured")}
                    >
                        Feature on landing page
                    </Checkbox>
                    {featuredCapReached && (
                        <Hint>Two villas are already featured — unfeature one first.</Hint>
                    )}
                </Field>
            </Grid>

            <Footer>
                <Button variation="secondary" type="button" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={isUpdatingStay} type="submit">
                    {isUpdatingStay ? "Saving…" : "Save changes"}
                </Button>
            </Footer>
        </FormShell>
    );
}
