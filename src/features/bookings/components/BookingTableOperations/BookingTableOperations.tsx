import { Filter } from "../../../../ui/Filter/Filter";
import { SortBy } from "../../../../ui/SortBy/SortBy";
import { TableOperations } from "../../../../ui/TableOperations/TableOperations";

export const BookingTableOperations = () => {
    // variable for resetting page to start whenever the filter is changed
    const paramToReset: Record<string, string> = {
        // params key with its value
        page: "1",
    };

    return (
        <TableOperations>
            <Filter
                filterField="status"
                options={[
                    { value: "all", label: "All" },
                    { value: "checked-out", label: "Checked out" },
                    { value: "checked-in", label: "Checked in" },
                    { value: "unconfirmed", label: "Unconfirmed" },
                ]}
                paramToReset={paramToReset}
            />

            <SortBy
                options={[
                    {
                        value: "startDate-desc",
                        label: "Sort by date (recent first)",
                    },
                    {
                        value: "startDate-asc",
                        label: "Sort by date (earlier first)",
                    },
                    {
                        value: "totalPrice-desc",
                        label: "Sort by amount (high first)",
                    },
                    {
                        value: "totalPrice-asc",
                        label: "Sort by amount (low first)",
                    },
                ]}
            />
        </TableOperations>
    );
};
