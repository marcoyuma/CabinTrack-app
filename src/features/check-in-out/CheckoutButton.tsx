import { Button } from "../../ui/Button/Button";

function CheckoutButton({ bookingId }: { bookingId: number }) {
    return (
        <Button variation="primary" size="small">
            Check out
        </Button>
    );
}

export default CheckoutButton;
