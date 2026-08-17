import { NavLink, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import {
    HiOutlineCalendarDays,
    HiOutlineHome,
    HiOutlineHomeModern,
} from "react-icons/hi2";
import { useIsStaff } from "../../features/stays/hooks/useIsStaff";
import DashboardFilter from "../../features/dashboard/components/DashboardFilter";
import { BookingDateRangeFilter } from "../../features/bookings/components/BookingDateRangeFilter";
import { media } from "../../styles/breakpoints";

// The pill doesn't wrap internally (it'd break the rounded shape) — icon-only labels below
// tablet keep it narrow enough in the common case, but BookingDateRangeFilter's date text
// (e.g. "Aug 01 — Aug 31 2026") can still push total content wider than a 375px screen, so
// this is a horizontal-scroll safety net rather than the primary mobile treatment.
export const NavList = styled.ul`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    padding: 0.6rem;
    border-radius: 9999px;
`;

// assign styled component and passed in react-router-dom 'NavLink' component
export const StyledNavLink = styled(NavLink)`
    &:link,
    &:visited {
        display: flex;
        align-items: center;
        gap: 0.8rem;

        color: var(--color-grey-600);
        font-size: var(--font-size-body);
        font-weight: 500;
        padding: 0.9rem 1.2rem;
        border-radius: 9999px;
        transition: all 0.3s;

        ${media.tablet(css`
            padding: 0.9rem 1.8rem;
        `)}
    }

    /* Icon-only below tablet: the label stays in the DOM (clip technique, not
       display:none) so screen readers still announce the route name. */
    & span {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;

        ${media.tablet(css`
            position: static;
            width: auto;
            height: auto;
            padding: 0;
            margin: 0;
            overflow: visible;
            clip: auto;
            white-space: normal;
        `)}
    }

    /* This works because react-router places the active class on the active NavLink */
    &.active:link,
    &.active:visited {
        color: var(--color-grey-0);
        background-color: var(--color-brand-600);
        box-shadow: var(--shadow-sm);
    }

    &:hover:not(.active) {
        color: var(--color-grey-800);
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 1.8rem;
        height: 1.8rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }

    &.active:link svg,
    &.active:visited svg {
        color: var(--color-grey-0);
    }

    &:hover:not(.active) svg {
        color: var(--color-brand-600);
    }
`;

// Separates the route links from the dashboard filter dropdown when both share the pill —
// otherwise a plain button next to NavLinks reads as just another route.
const Divider = styled.li`
    width: 1px;
    align-self: stretch;
    margin: 0.4rem 0.2rem;
    background-color: var(--color-grey-100);
`;

export function MainNav() {
    // Client-side gate for the entry point — not a security boundary, the RLS policies in
    // 0016_admin_staff_catalog_writes.sql are. Hides the link entirely for non-staff instead of
    // showing a disabled state, so a non-staff account never sees a feature it can't use.
    const { isStaff } = useIsStaff();
    // The "last N days" filter only makes sense on the dashboard, but it lives in the shared
    // Header — so it's folded into this same pill only while that route is active. Same idea
    // for Bookings' date range: it used to be duplicated inside BookingsOverTimeChart's header
    // and BookingTable's toolbar (see useBookingDateRangeParam.ts), now it's one control here.
    const { pathname } = useLocation();
    const isDashboardRoute = pathname === "/dashboard";
    const isBookingsRoute = pathname === "/bookings";

    return (
        <nav>
            <NavList>
                <li>
                    <StyledNavLink to="/dashboard">
                        <HiOutlineHome />
                        <span>Dashboard</span>
                    </StyledNavLink>
                </li>
                {isStaff && (
                    <li>
                        <StyledNavLink to="/stays">
                            <HiOutlineHomeModern />
                            <span>Stays Management</span>
                        </StyledNavLink>
                    </li>
                )}
                {isStaff && (
                    <li>
                        <StyledNavLink to="/bookings">
                            <HiOutlineCalendarDays />
                            <span>Bookings</span>
                        </StyledNavLink>
                    </li>
                )}
                {isDashboardRoute && (
                    <>
                        <Divider />
                        <li>
                            <DashboardFilter />
                        </li>
                    </>
                )}
                {isStaff && isBookingsRoute && (
                    <>
                        <Divider />
                        <li>
                            <BookingDateRangeFilter />
                        </li>
                    </>
                )}
            </NavList>
        </nav>
    );
}
