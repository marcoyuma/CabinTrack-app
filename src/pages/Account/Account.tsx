import { UpdateUserPasswordForm } from "../../features/authentication/components/UpdateUserPasswordForm";
import { UpdateUserDataForm } from "../../features/authentication/components/UpdateUserDataForm";
import { Logout } from "../../features/authentication/components/Logout";
import { Heading } from "../../ui/Heading/Heading";
import { Row } from "../../ui/Row/Row";

export function Account() {
    return (
        <>
            <Heading as="h1">Update your account</Heading>

            <Row>
                <Heading as="h3">Update user data</Heading>
                <UpdateUserDataForm />
            </Row>

            <Row>
                <Heading as="h3">Update password</Heading>
                <UpdateUserPasswordForm />
            </Row>

            <Row>
                <Heading as="h3">Log out</Heading>
                <Logout />
            </Row>
        </>
    );
}
