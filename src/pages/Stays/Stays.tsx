import { useMemo } from "react";
import { Spinner } from "../../ui/Spinner/Spinner";
import { useStays } from "../../features/stays/hooks/useStays";
import { useStaysOccupancy } from "../../features/stays/hooks/useStaysOccupancy";
import { useStayImages } from "../../features/stays/hooks/useStayImages";
import { useStayTableState } from "../../features/stays/hooks/useStayTableState";
import { buildStayCovers, buildStayImageCounts } from "../../features/stays/utils/stayImages";
import StaysStats from "../../features/stays/components/StaysStats";
import { StayTable } from "../../features/stays/components/StayTable";

export function Stays() {
    const { stays, isPending: isStaysLoading } = useStays();
    const { occupiedCount, isOccupancyLoading } = useStaysOccupancy();
    const { images, isPending: isImagesLoading } = useStayImages();

    const imageCounts = useMemo(() => buildStayImageCounts(images), [images]);
    const covers = useMemo(() => buildStayCovers(images), [images]);
    const featuredCount = useMemo(() => stays.filter((s) => s.is_featured).length, [stays]);

    const {
        sortedFiltered,
        sortKey,
        sortDirection,
        toggleSort,
        filters,
        setFilters,
        resetFilters,
        search,
        setSearch,
    } = useStayTableState(stays, imageCounts);

    if (isStaysLoading || isOccupancyLoading) {
        return <Spinner />;
    }

    return (
        <>
            <StaysStats
                totalStaysCount={stays.length}
                occupiedCount={occupiedCount}
            />

            <StayTable
                stays={sortedFiltered}
                totalCount={stays.length}
                isPending={isImagesLoading}
                covers={covers}
                imageCounts={imageCounts}
                featuredCount={featuredCount}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={toggleSort}
                filters={filters}
                onFiltersChange={setFilters}
                onResetFilters={resetFilters}
                search={search}
                onSearchChange={setSearch}
            />
        </>
    );
}
