type EmptyProps = {
    resourceName: string;
};
export const Empty = ({ resourceName }: EmptyProps) => {
    return <p>No {resourceName} could be found.</p>;
};
