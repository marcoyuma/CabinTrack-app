type EmptyProps = {
    resourceName: string;
};
export function Empty({ resourceName }: EmptyProps) {
    return <p>No {resourceName} could be found.</p>;
}
