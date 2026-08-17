const PHOTON_URL = "https://photon.komoot.io";

// minLon,minLat,maxLon,maxLat — Sabang to Merauke. A hard filter, so "ubud" can never return the
// residential estate of the same name outside Bali, and "canggu" can't lose to a lookalike
// abroad. Widen this (or drop it) if villas outside Indonesia are ever added.
const INDONESIA_BBOX = "95.0,-11.1,141.05,6.1";

/** Photon's granularity classes, coarsest to finest. Drives the zoom table in utils/placeZoom.ts. */
export type PlaceType =
    | "country"
    | "state"
    | "county"
    | "city"
    | "district"
    | "locality"
    | "street"
    | "house"
    | "other";

export interface PlaceResult {
    /** Human-readable line shown in the suggestion list. */
    label: string;
    /** Candidate for the villa's `location` column, already in "{District}, Bali" shape. */
    locationSuggestion: string;
    lat: number;
    lng: number;
    /** [minLon, minLat, maxLon, maxLat] — present on most results, absent on bare points. */
    extent?: [number, number, number, number];
    type: PlaceType;
}

interface PhotonProperties {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    type?: string;
    extent?: [number, number, number, number];
}

interface PhotonFeature {
    properties: PhotonProperties;
    geometry: { coordinates: [number, number] };
}

const PLACE_TYPES: PlaceType[] = [
    "country",
    "state",
    "county",
    "city",
    "district",
    "locality",
    "street",
    "house",
];

const toPlaceType = (raw?: string): PlaceType =>
    PLACE_TYPES.find((type) => type === raw) ?? "other";

/** Joins the parts that exist, in order, skipping blanks. */
const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(", ");

/**
 * Builds the `location` candidate in the two-part comma format the customer site depends on
 * (`stay-location-section.tsx` splits on the comma for its "by car" sentence).
 *
 * Built from Photon's structured fields rather than its display label on purpose: the label is
 * a full administrative chain ("Canggu, North Kuta, Badung, Bali, Indonesia") that a human would
 * have to trim by hand every single time. For an area result the area's own name is already the
 * district; for a building or street the containing district is what staff mean.
 */
const toLocationSuggestion = (props: PhotonProperties, type: PlaceType): string => {
    const isArea = type === "city" || type === "district" || type === "locality";
    const area = isArea ? props.name : (props.district ?? props.city);

    return join(area, props.state ?? props.country);
};

const toPlaceResult = (feature: PhotonFeature): PlaceResult => {
    const props = feature.properties;
    const type = toPlaceType(props.type);
    const [lng, lat] = feature.geometry.coordinates;

    return {
        label: join(
            join(props.street, props.housenumber) || props.name,
            props.district ?? props.city,
            props.state,
        ),
        locationSuggestion: toLocationSuggestion(props, type),
        lat,
        lng,
        extent: props.extent,
        type,
    };
};

/**
 * Search-as-you-type place lookup via Photon (komoot), over OpenStreetMap data.
 *
 * Photon rather than Nominatim, despite decision 2 in STAYS-INPUT-DECISIONS.md naming the
 * latter: the OSMF usage policy forbids what this input needs — "Auto-complete search […] you
 * must not implement such a service on the client side using the API." Photon is built for
 * exactly this, is typo-tolerant, and keeps the no-API-key/no-billing property that made
 * Nominatim attractive in the first place.
 *
 * @param query free text typed by staff
 * @param signal aborts a superseded request — without it a slow early keystroke can resolve
 *               after a fast later one and overwrite fresher suggestions
 */
export const searchPlaces = async (
    query: string,
    signal?: AbortSignal,
): Promise<PlaceResult[]> => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const url =
        `${PHOTON_URL}/api/?q=${encodeURIComponent(trimmed)}` +
        `&limit=6&lang=en&bbox=${INDONESIA_BBOX}`;

    const response = await fetch(url, { signal, headers: { Accept: "application/json" } });

    if (!response.ok) {
        console.error(`Photon responded ${response.status}`);
        throw new Error("Place search is unavailable right now — try again in a moment");
    }

    const body = (await response.json()) as { features?: PhotonFeature[] };

    return (body.features ?? []).map(toPlaceResult);
};

/**
 * Names the point the pin is sitting on, so staff can confirm the position by reading a street
 * name instead of comparing decimal degrees.
 *
 * @returns a one-line address, or an empty string when the point has no nameable feature
 */
export const reverseGeocode = async (
    lat: number,
    lng: number,
    signal?: AbortSignal,
): Promise<string> => {
    const url = `${PHOTON_URL}/reverse?lat=${lat}&lon=${lng}&lang=en&limit=1`;

    const response = await fetch(url, { signal, headers: { Accept: "application/json" } });

    if (!response.ok) {
        console.error(`Photon reverse responded ${response.status}`);
        throw new Error("Could not look up this position");
    }

    const body = (await response.json()) as { features?: PhotonFeature[] };
    const props = body.features?.[0]?.properties;
    if (!props) return "";

    return join(props.street ?? props.name, props.district ?? props.city, props.state);
};
