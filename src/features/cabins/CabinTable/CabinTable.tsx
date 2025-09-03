import Empty from "../../../ui/Empty/Empty";
import { Table } from "../../../ui/Table/Table";
import { Menus } from "../../../ui/Menus/Menus";
import Spinner from "../../../ui/Spinner/Spinner";

import { CabinRow } from "../CabinRow/CabinRow";

import { useCabins } from "../hooks/useCabins";
import { useURL } from "../../../hooks/useURL";

import { sortData } from "../../../utils/helpers";

/**
 * CabinTable component that renders a table of cabins
 * It uses the Table component to wrap the header and rows
 * The 'columns' prop is passed to define the grid template columns
 * This allows child components to access the 'columns' prop via context and render the header and rows accordingly
 *
 * @returns - A styled table component with the cabins data passed to it
 */
export const CabinTable = () => {
    // destructuring the cabins data from custom hooks that calls 'getCabins' api
    const { isPending, cabins } = useCabins();

    // filter cabin data
    // get value from custom hooks by defining params query key name
    const { valueFromParams: discountValueFromParams } = useURL("discount");

    // get value from params, if null set to 'all' as default
    const filterValue = discountValueFromParams || "all";

    let filteredCabinsByDiscount: typeof cabins;
    if (filterValue === "all") {
        filteredCabinsByDiscount = cabins;
    } else if (filterValue === "with-discount") {
        filteredCabinsByDiscount = cabins?.filter(
            (value) => (value.discount ?? 0) > 0
        );
    } else {
        filteredCabinsByDiscount = cabins?.filter(
            (value) => (value.discount ?? 0) === 0
        );
    }

    // sort cabin data
    // get value from params using 'useURL' by defining query key name
    const { valueFromParams: sortByValueFromParams } = useURL("sortBy");
    console.log(sortByValueFromParams);

    const sortedValue = sortByValueFromParams || "name-asc";

    // call 'sortData' with arguments of 'filteredCabinsByDiscount' array from previous filter based on 'discount' url key and 'sortedValue' string based on 'sortBy' url key
    const sortedCabins = sortData(filteredCabinsByDiscount, sortedValue);

    // early validation while data still on fetching, then the spinner rendered
    if (isPending) return <Spinner />;

    // cabins length validation
    if (!cabins?.length) return <Empty resourceName="cabins" />;

    return (
        // using Menus component to wrap the Table component, so CabinRow component can use the value from menus context as child
        <Menus>
            {/* using Table component to wrap the header and rows. passing the 'columns' prop to define the grid template columns  */}
            {/* this allows child components to access the 'columns' prop via context and render the header and rows accordingly */}
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                {/* wrap child into 6 columns */}
                <Table.Header>
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>

                {/* using Table.Body to render the cabins data */}
                {/* passing the cabins data to render the CabinRow component for each cabin */}
                <Table.Body
                    // passing the filtered and sorted cabin data to the CabinRow component
                    data={sortedCabins ?? []}
                    // using the render prop to render the CabinRow component for each cabin
                    render={(cabin) => (
                        <CabinRow cabin={cabin} key={cabin.name} />
                    )}
                />
            </Table>
        </Menus>
    );
};
