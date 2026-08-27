import styled, { css } from "styled-components";
import { format, isToday } from "date-fns";
import {
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineCheckCircle,
    HiOutlineCurrencyDollar,
    HiOutlineHomeModern,
} from "react-icons/hi2";

import { Flag } from "../../../ui/Flag/Flag";
import { DataItem } from "../../../ui/DataItem/DataItem";

import {
    formatCurrency,
    formatDistanceFromNow,
} from "../../../shared/utils/helpers";
import { DetailedBookingDataType } from "../../../types/bookings.type";
import { Guest as GuestType } from "../../../types/guests.type";
import { media } from "../../../styles/breakpoints";

const StyledBookingDataBox = styled.section`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    overflow: hidden;
`;

// Cabin-name line + date-range line collide as one flex row on narrow screens — wraps to two
// stacked lines below tablet instead.
const Header = styled.header`
    background-color: var(--color-brand-500);
    padding: 1.6rem 2rem;
    color: #e0e7ff;
    font-size: var(--font-size-body);
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.8rem;
    justify-content: space-between;

    svg {
        height: 2.8rem;
        width: 2.8rem;
    }

    & div:first-child {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        font-weight: 600;
        font-size: var(--font-size-body);
    }

    & span {
        font-family: "Sono";
        font-size: 1.6rem;
        margin-left: 4px;
    }

    ${media.tablet(css`
        padding: 2rem 4rem;

        svg {
            height: 3.2rem;
            width: 3.2rem;
        }

        & div:first-child {
            gap: 1.6rem;
            font-size: 1.8rem;
        }

        & span {
            font-size: 2rem;
        }
    `)}
`;

const Section = styled.section`
    padding: var(--spacing-card-padding) var(--spacing-card-padding) 1.2rem;
`;

// Name/email/national-ID row wraps below tablet instead of overflowing off the box edge.
const Guest = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.8rem 1.2rem;
    margin-bottom: 1.6rem;
    color: var(--color-grey-500);

    & p:first-of-type {
        font-weight: 500;
        color: var(--color-grey-700);
    }
`;

type PriceProps = {
    isPaid: boolean;
};
const Price = styled.div<PriceProps>`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.8rem;
    justify-content: space-between;
    padding: 1.2rem 1.6rem;
    border-radius: var(--border-radius-sm);
    margin-top: 2.4rem;

    background-color: ${(props) =>
        props.isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
    color: ${(props) =>
        props.isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};

    & p:last-child {
        text-transform: uppercase;
        font-size: 1.4rem;
        font-weight: 600;
    }

    svg {
        height: 2.4rem;
        width: 2.4rem;
        color: currentColor !important;
    }

    ${media.tablet(css`
        padding: 1.6rem 3.2rem;
    `)}
`;

const Footer = styled.footer`
    padding: 1.6rem 2rem;
    font-size: 1.2rem;
    color: var(--color-grey-500);
    text-align: right;

    ${media.tablet(css`
        padding: 1.6rem 4rem;
    `)}
`;

// A purely presentational component. Moved from features/bookings (deleted) — this is
// the only piece of the old bookings CRUD feature check-in-out actually needs.
export function BookingDataBox({
    booking,
}: {
    booking: DetailedBookingDataType;
}) {
    const {
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations,
        isPaid,
        cabins,
        guests,
    } = booking;

    const { name: cabinName } = cabins ?? { name: "-" };
    const {
        fullName: guestName,
        email,
        nationality,
        countryFlag,
        nationalID,
    } = guests ?? ({} as GuestType);

    return (
        <StyledBookingDataBox>
            <Header>
                <div>
                    <HiOutlineHomeModern />
                    <p>
                        {numNights} nights in Cabin <span>{cabinName}</span>
                    </p>
                </div>

                <p>
                    {format(new Date(startDate ?? "-"), "EEE, MMM dd yyyy")} (
                    {isToday(new Date(startDate ?? "-"))
                        ? "Today"
                        : formatDistanceFromNow(startDate ?? "-")}
                    ) &mdash;{" "}
                    {format(new Date(endDate ?? "-"), "EEE, MMM dd yyyy")}
                </p>
            </Header>

            <Section>
                <Guest>
                    {countryFlag && (
                        <Flag
                            src={countryFlag}
                            alt={`Flag of ${nationality}`}
                        />
                    )}
                    <p>
                        {guestName}{" "}
                        {numGuests > 1 ? `+ ${numGuests - 1} guests` : ""}
                    </p>
                    <span>&bull;</span>
                    <p>{email}</p>
                    <span>&bull;</span>
                    <p>National ID {nationalID}</p>
                </Guest>

                {observations && (
                    <DataItem
                        icon={<HiOutlineChatBubbleBottomCenterText />}
                        label="Observations"
                    >
                        {observations}
                    </DataItem>
                )}

                <DataItem
                    icon={<HiOutlineCheckCircle />}
                    label="Breakfast included?"
                >
                    {hasBreakfast ? "Yes" : "No"}
                </DataItem>

                <Price isPaid={isPaid}>
                    <DataItem
                        icon={<HiOutlineCurrencyDollar />}
                        label={`Total price`}
                    >
                        {formatCurrency(totalPrice)}

                        {hasBreakfast &&
                            ` (${formatCurrency(
                                cabinPrice,
                            )} cabin + ${formatCurrency(
                                extrasPrice,
                            )} breakfast)`}
                    </DataItem>

                    <p>{isPaid ? "Paid" : "Will pay at property"}</p>
                </Price>
            </Section>

            <Footer>
                <p>
                    Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
                </p>
            </Footer>
        </StyledBookingDataBox>
    );
}
