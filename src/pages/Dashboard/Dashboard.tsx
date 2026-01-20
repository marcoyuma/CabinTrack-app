import DashboardFilter from "../../features/dashboard/components/DashboardFilter";
import DashboardLayout from "../../features/dashboard/components/DashboardLayout";
import { Heading } from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";

export const Dashboard = () => {
    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Dashboard</Heading>
                <DashboardFilter />
            </Row>

            <DashboardLayout />
        </>
    );
};
