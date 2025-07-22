import Heading from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";
import { CabinTable } from "../../features/cabins/CabinTable/CabinTable";

function Cabins() {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All cabins</Heading>
                <p>filter / sort</p>
            </Row>
            <Row>
                <CabinTable />
            </Row>
        </>
    );
}

export default Cabins;
