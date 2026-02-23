import { Input } from "../../../../ui/Input/Input";

export function DateRangeInput({
    value,
    onClick,
}: {
    value: string;
    onClick: () => void;
}) {
    return (
        <Input
            id="dateRange"
            readOnly
            type="text"
            value={value}
            onClick={onClick}
            placeholder="Select date range"
            style={{ cursor: "pointer" }}
        />
    );
}
