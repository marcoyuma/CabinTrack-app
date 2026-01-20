import { Heading } from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";
import UpdateSettingsForm from "../../features/settings/UpdateSettingsForm/UpdateSettingsForm";

export const Settings = () => {
    return (
        <Row type="vertical">
            <Heading as="h1">Update hotel settings</Heading>
            <UpdateSettingsForm />
        </Row>
    );
};
