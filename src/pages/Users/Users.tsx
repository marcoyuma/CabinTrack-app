import SignupForm from "../../features/authentication/components/SignupForm";
import { Heading } from "../../ui/Heading/Heading";

export const Users = () => {
    return (
        <>
            <Heading as="h1">Create a new user</Heading>
            <SignupForm />
        </>
    );
};
