import { PlaceType } from "../services/geocoding";

/**
 * Never zoom past street level when fitting a result's bounding box.
 *
 * A building's `extent` is only a few metres across, and an unconstrained `fitBounds` would zoom
 * to Leaflet's maximum — the villa fills the screen and staff lose every landmark they'd use to
 * tell whether the pin is on the right building.
 */
export const MAX_FIT_ZOOM = 18;

/**
 * Fallback zoom per result granularity, used only when a result carries no `extent`.
 *
 * Picking one fixed zoom for every result is what made searching "jakarta" show a single
 * building at the city's centroid rather than the city — a city result has to be shown at city
 * scale to be recognisable as an answer.
 */
const ZOOM_BY_TYPE: Record<PlaceType, number> = {
    country: 5,
    state: 7,
    county: 9,
    city: 11,
    district: 13,
    locality: 14,
    street: 16,
    house: 18,
    other: 13,
};

export const zoomForPlaceType = (type: PlaceType): number => ZOOM_BY_TYPE[type];
