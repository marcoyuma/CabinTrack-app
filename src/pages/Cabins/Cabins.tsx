import { useState } from "react";
import { Button } from "../../ui/Button/Button";
import Heading from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";
import { CabinTable } from "../../features/cabins/CabinTable/CabinTable";
import { CreateCabinForm } from "../../features/cabins/CreateCabinForm/CreateCabinForm";

function Cabins() {
    const [showForm, setShowForm] = useState<boolean>(false);
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">All cabins</Heading>
                <p>filter / sort</p>
            </Row>
            <Row>
                <CabinTable />
                <Button onClick={() => setShowForm((showForm) => !showForm)}>
                    Add new cabin
                </Button>
                {showForm && <CreateCabinForm />}
            </Row>
        </>
    );
}

export default Cabins;
