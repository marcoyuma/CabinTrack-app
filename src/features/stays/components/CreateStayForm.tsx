import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styled from "styled-components";

import { Checkbox } from "../../../ui/Checkbox/Checkbox";
import { Button } from "../../../ui/Button/Button";

import {
    stayCreateSchema,
    StayCreateFormValues,
    StayCreateInput,
} from "../types/stay-create.schema";
import { stayImageUploadSchema } from "../types/stay-image-upload.schema";
import { useCreateStay } from "../hooks/useCreateStay";
import { useAmenities } from "../hooks/useAmenities";
import { deriveSlug } from "../utils/deriveSlug";
import { StayImageDraft, StayImageUploader } from "./StayImageUploader";
import { AmenityPicker } from "./AmenityPicker";
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

const SuggestButton = styled.button`
    align-self: flex-start;
    background: none;
    border: none;
    padding: 0;
    font-size: 1.2rem;
    color: var(--color-brand-600);
    text-decoration: underline;
    cursor: pointer;
    text-align: left;
`;

interface CreateStayFormProps {
    /** How many villas are already featured — the landing page is built for exactly two. */
    featuredCount: number;
    onClose: () => void;
}

/**
 * Create form rendered as modal content (opened from the "Add Villa" button on the Villas page).
 *
 * Wider than the edit modal (80rem) because it carries two things editing doesn't: a photo
 * thumbnail grid and the amenity picker. An earlier version of this form was a full page for
 * exactly that reason; a wide scrolling modal turned out to fit both, and keeps adding a villa
 * in the same shape as editing one.
 *
 * Slug is shown but never typed — it follows `name` and is finalised against the database on
 * save (STAYS-INPUT-DECISIONS.md decision 1). lat/lng likewise come from the map picker rather
 * than number inputs (decision 2).
 */
export function CreateStayForm({
    featuredCount,
    onClose,
}: CreateStayFormProps) {
    const [images, setImages] = useState<StayImageDraft[]>([]);
    const [suggestedLocation, setSuggestedLocation] = useState("");
    const { createVilla, isCreatingStay } = useCreateStay();
    const { amenities } = useAmenities();

    // Same rule the edit form enforces: turning featured ON is capped at two villas, turning it
    // OFF is always allowed. Enforced here too so a third featured villa can't enter via create.
    const featuredCapReached = featuredCount >= 2;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<StayCreateFormValues, unknown, StayCreateInput>({
        resolver: zodResolver(stayCreateSchema),
        // RHF's default ("onSubmit") only populates `errors` after a submit attempt, so the
        // error popups would stay invisible while staff are still filling the form out. "onBlur"
        // surfaces them the moment a field is left invalid — the point of a preventive, explicit
        // error UI is catching the bad value before submit, not just explaining it after.
        mode: "onBlur",
        defaultValues: {
            discount: 0,
            is_new: false,
            is_featured: false,
            amenityIds: [],
        },
    });

    const amenityIds = watch("amenityIds");
    const name = watch("name") ?? "";
    const lat = watch("lat");
    const lng = watch("lng");

    const previewSlug = deriveSlug(name);

    const onSubmit: SubmitHandler<StayCreateInput> = (data) => {
        const readyImages = images.filter(
            (img) => img.status === "done" && img.processed,
        );
        if (readyImages.length !== images.length) {
            toast.error(
                "Some photos failed to process — remove or re-add them before saving",
            );
            return;
        }

        // Photos live outside react-hook-form (they're processed on pick, not on submit), so
        // their schema has to be run by hand here. It covers the two invariants the database
        // won't catch: at least one photo, and no two photos sharing an alt text.
        const imageCheck = stayImageUploadSchema.safeParse(
            readyImages.map((img) => ({
                file: img.file,
                alt: img.alt,
                role: img.role,
            })),
        );

        if (!imageCheck.success) {
            toast.error(imageCheck.error.issues[0].message);
            return;
        }

        const sharedAmenities = amenities.filter((a) => a.is_shared);

        createVilla(
            {
                stay: data,
                images: readyImages.map((img) => ({
                    file: img.file,
                    alt: img.alt,
                    role: img.role,
                    // Non-null assertion is safe: the filter above keeps only "done" drafts,
                    // and processStayImage's result is what marks a draft done.
                    ...img.processed!,
                })),
                sharedAmenities,
            },
            { onSuccess: onClose },
        );
    };

    const stillProcessing = images.some((img) => img.status === "processing");

    return (
        <FormShell
            $width="80rem"
            // The zod schema already covers everything the `min`/`max` attributes on the number
            // inputs express (and more) — without this, the browser's own constraint-validation
            // bubble fires too, in a style that doesn't match `ErrorText`'s popup.
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >
            <Title>Add villa</Title>
            <Subtitle>
                New villas need at least one photo before they can go live.
            </Subtitle>

            <Grid>
                <Field>
                    <Label htmlFor="name">Name</Label>
                    <TextInput
                        id="name"
                        type="text"
                        $hasError={!!errors.name}
                        {...register("name")}
                    />
                    {errors.name && (
                        <ErrorText>{errors.name.message}</ErrorText>
                    )}
                </Field>

                <Field>
                    <Label htmlFor="slug-preview">Slug</Label>
                    <TextInput
                        id="slug-preview"
                        type="text"
                        value={previewSlug}
                        placeholder="follows the name"
                        disabled
                        readOnly
                    />
                    <Hint>
                        Built from the name. A number is added on save if this
                        URL is taken.
                    </Hint>
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
                    {/* The place search only ever offers a value here — it never writes it.
                        The suggestion arrives already in the two-part "{District}, Bali" shape
                        (built from the geocoder's structured fields in geocoding.ts), but it is
                        still a guess about which administrative level staff mean, so a human
                        confirms it. */}
                    {suggestedLocation && (
                        <SuggestButton
                            type="button"
                            onClick={() =>
                                setValue("location", suggestedLocation)
                            }
                        >
                            Use "{suggestedLocation}"
                        </SuggestButton>
                    )}
                    {errors.location && (
                        <ErrorText>{errors.location.message}</ErrorText>
                    )}
                </Field>

                <Field>
                    <Label htmlFor="price_per_night">
                        Price per night (Rp)
                    </Label>
                    <TextInput
                        id="price_per_night"
                        type="number"
                        min={1}
                        max={1_000_000_000}
                        step={1}
                        $hasError={!!errors.price_per_night}
                        {...register("price_per_night", {
                            valueAsNumber: true,
                        })}
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
                    {errors.discount && (
                        <ErrorText>{errors.discount.message}</ErrorText>
                    )}
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
                    {errors.capacity && (
                        <ErrorText>{errors.capacity.message}</ErrorText>
                    )}
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
                    {errors.beds && (
                        <ErrorText>{errors.beds.message}</ErrorText>
                    )}
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
                    {errors.area && (
                        <ErrorText>{errors.area.message}</ErrorText>
                    )}
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

                <SectionLabel>Map position</SectionLabel>

                <Field $full>
                    {/* lat/lng stay registered so zod still validates them and RHF still owns
                        the values; the picker is just the input device. */}
                    <input
                        type="hidden"
                        {...register("lat", { valueAsNumber: true })}
                    />
                    <input
                        type="hidden"
                        {...register("lng", { valueAsNumber: true })}
                    />
                    <StayLocationPicker
                        lat={lat}
                        lng={lng}
                        onCoordinatesChange={(newLat, newLng) => {
                            setValue("lat", newLat, { shouldValidate: true });
                            setValue("lng", newLng, { shouldValidate: true });
                        }}
                        onLocationSuggest={setSuggestedLocation}
                        // Not the raw zod message: with no pin the registered inputs are empty,
                        // so valueAsNumber yields NaN and zod reports "expected number, received
                        // NaN" — true, but meaningless to the person looking at a blank map.
                        error={
                            errors.lat || errors.lng
                                ? "Search for a place, then drag the pin onto the villa"
                                : undefined
                        }
                    />
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
                        <Hint>
                            Two villas are already featured — unfeature one
                            first.
                        </Hint>
                    )}
                </Field>

                <SectionLabel>Photos</SectionLabel>

                <Field $full>
                    <StayImageUploader images={images} onChange={setImages} />
                    {images.length === 0 && (
                        <Hint>
                            At least one photo is required — the first becomes
                            the cover.
                        </Hint>
                    )}
                </Field>

                <SectionLabel>Amenities</SectionLabel>

                <Field $full>
                    <AmenityPicker
                        selectedIds={amenityIds ?? []}
                        onChange={(ids) => setValue("amenityIds", ids)}
                    />
                    <Hint>
                        The six shared amenities are attached automatically —
                        pick only what is specific to this villa.
                    </Hint>
                </Field>
            </Grid>

            <Footer>
                <Button variation="secondary" type="button" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    disabled={isCreatingStay || stillProcessing}
                    type="submit"
                >
                    {isCreatingStay ? "Creating…" : "Create villa"}
                </Button>
            </Footer>
        </FormShell>
    );
}
