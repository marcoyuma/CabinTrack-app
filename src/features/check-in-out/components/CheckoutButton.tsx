import { Button } from "../../../ui/Button/Button";
import { useCheckout } from "../hooks/useCheckout";

/**
 * Renders a checkout action button that triggers the checkout process for a specific booking
 */
export function CheckoutButton({ bookingId }: { bookingId: number }) {
    const { checkout, isCheckingOut } = useCheckout();
    return (
        <Button
            variation="primary"
            size="small"
            onClick={() => checkout(bookingId)}
            disabled={isCheckingOut}
        >
            Check out
        </Button>
    );
}
