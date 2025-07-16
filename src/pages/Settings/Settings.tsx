import Heading from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";
import UpdateSettingsForm from "./UpdateSettingsForm/UpdateSettingsForm";

function Settings() {
    return (
        <Row type="vertical">
            <Heading as="h1">Update hotel settings</Heading>
            <UpdateSettingsForm />
        </Row>
    );
}

export default Settings;
