import styled from "styled-components";
import Spinner from "../../../ui/Spinner/Spinner";
import { CabinRow } from "../CabinRow/CabinRow";
import { useCabins } from "../hooks/useCabins";
import { Table } from "../../../ui/Table/Table";

// const Table = styled.div`
//     border: 1px solid var(--color-grey-200);

//     font-size: 1.4rem;
//     background-color: var(--color-grey-0);
//     border-radius: 7px;
//     overflow: hidden;
// `;

// const TableHeader = styled.header`
//     display: grid;
//     grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//     column-gap: 2.4rem;
//     align-items: center;

//     background-color: var(--color-grey-50);
//     border-bottom: 1px solid var(--color-grey-100);
//     text-transform: uppercase;
//     letter-spacing: 0.4px;
//     font-weight: 600;
//     color: var(--color-grey-600);
//     padding: 1.6rem 2.4rem;
// `;

export const CabinTable = () => {
    // destructuring the cabins data from custom hooks that calls 'getCabins' api
    const { isPending, cabins } = useCabins();
    console.log(isPending, cabins);

    // early validation while data still on fetching, then the spinner rendered
    if (isPending) return <Spinner />;
    return (
        // wrap the content and make sure browser knows the rule cuz we styled it with div
        <Table role="table">
            {/* wrap child into 6 columns */}
            <TableHeader role="row">
                <div></div>
                <div>Cabin</div>
                <div>Capacity</div>
                <div>Price</div>
                <div>Discount</div>
                <div></div>
            </TableHeader>
            {cabins?.map((cabin) => (
                <CabinRow cabin={cabin} key={cabin.id} />
            ))}
        </Table>
    );
};
