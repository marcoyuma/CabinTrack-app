import Spinner from "../../../ui/Spinner/Spinner";
import { CabinRow } from "../CabinRow/CabinRow";
import { useCabins } from "../hooks/useCabins";
import { Table } from "../../../ui/Table/Table";

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
    console.log(isPending, cabins);

    // early validation while data still on fetching, then the spinner rendered
    if (isPending) return <Spinner />;
    return (
        // using Table component to wrap the header and rows. passing the 'columns' prop to define the grid template columns
        // this allows child components to access the 'columns' prop via context and render the header and rows accordingly
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
            {cabins?.map((cabin) => (
                <CabinRow cabin={cabin} key={cabin.id} />
            ))}
        </Table>
    );
};
