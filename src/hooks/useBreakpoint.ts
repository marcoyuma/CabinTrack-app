import { useSyncExternalStore } from "react";

const QUERIES = {
    tablet: "(min-width: 768px)",
    desktop: "(min-width: 1024px)",
} as const;

function subscribe(query: string, callback: () => void) {
    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener("change", callback);
    return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
    return window.matchMedia(query).matches;
}

// Drives numeric Recharts props (ResponsiveContainer height, Pie radius, Legend
// width) that plain CSS media queries can't reach, since they're read as JS
// props, not CSS.
export function useBreakpoint() {
    const isTablet = useSyncExternalStore(
        (callback) => subscribe(QUERIES.tablet, callback),
        () => getSnapshot(QUERIES.tablet),
    );
    const isDesktop = useSyncExternalStore(
        (callback) => subscribe(QUERIES.desktop, callback),
        () => getSnapshot(QUERIES.desktop),
    );

    return {
        isMobile: !isTablet,
        isTablet: isTablet && !isDesktop,
        isDesktop,
    };
}
