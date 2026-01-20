import { Heading } from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";
import { CabinTable } from "../../features/cabins/components/CabinTable/CabinTable";
import { AddCabin } from "../../features/cabins/components/AddCabin/AddCabin";
import { CabinTableOperations } from "../../features/cabins/components/CabinTableOperations/CabinTableOperations";

export const Cabins = () => {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All cabins</Heading>
                <CabinTableOperations />
            </Row>
            <Row>
                <CabinTable />
                <AddCabin />
            </Row>
        </>
    );
};
