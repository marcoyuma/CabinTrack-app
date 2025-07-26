import { ReactNode } from "react";
import styled from "styled-components";
import { TableContext } from "./context/TableContext";
import { useTableContext } from "./context/useTableContext";

const StyledTable = styled.div`
    border: 1px solid var(--color-grey-200);
    font-size: 1.4rem;
    background-color: var(--color-grey-0);
    border-radius: 7px;
    overflow: hidden;
`;

// CommonRow is a styled component that can be used for both header and row
// It accepts a prop 'columns' to define the grid template columns. This allows us to reuse the same styles for both header and row components
const CommonRow = styled.div<{ columns: string }>`
    display: grid;

    /* 'CommonRow' component receive one props named 'columns' and it'll implemented as grid style value */
    grid-template-columns: ${(props) => props.columns};
    column-gap: 2.4rem;
    align-items: center;
    transition: none;
`;

const StyledHeader = styled(CommonRow)`
    padding: 1.6rem 2.4rem;

    background-color: var(--color-grey-50);
    border-bottom: 1px solid var(--color-grey-100);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-600);
`;

const StyledRow = styled(CommonRow)`
    padding: 1.2rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const StyledBody = styled.section`
    margin: 0.4rem 0;
`;

const Footer = styled.footer`
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    padding: 1.2rem;

    /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
    &:not(:has(*)) {
        display: none;
    }
`;

const Empty = styled.p`
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    margin: 2.4rem;
`;

// Table component that accepts children and columns as props
interface TableProps {
    children: ReactNode;
    columns: string;
}

/**
 * Table component that wraps its children in a styled div and provides a context with the 'columns' prop
 *
 * @param children - The children to be rendered inside the table
 * @param columns - The grid template columns to be used for the table rows and header
 * This prop is used to define the grid template columns for the table rows and header
 * It allows child components to access the 'columns' prop via context and render the header and rows accordingly
 * @returns - A styled table component with the children passed to it
 * The role is set to 'table' to indicate that this is a table component
 * This allows child components to access the 'columns' prop without passing it down manually
 */
export const Table = ({ children, columns }: TableProps) => {
    return (
        <TableContext.Provider value={{ columns }}>
            <StyledTable role="table">{children}</StyledTable>
        </TableContext.Provider>
    );
};

/**
 * Header component that accepts children and renders them in a styled header
 *
 * @param children - The children to be rendered inside the header
 * @returns - A styled header component with the children passed to it
 * The role is set to 'row' to indicate that this is a header row
 * The 'columns' prop is accessed from the 'context' to define the grid template columns
 */
const Header = ({ children }: { children: ReactNode }) => {
    // use the context to get the columns prop this allows us to use the same columns prop in the header and row components
    // without passing it down manually
    const { columns } = useTableContext();

    // return a styled header with the children passed to it
    // the role is set to 'row' to indicate that this is a header row and defined as a header element
    // this allows child components to access the 'columns' prop via context and render the header and rows accordingly
    return (
        <StyledHeader role="row" columns={columns} as="header">
            {children}
        </StyledHeader>
    );
};

/**
 * Row component that accepts children and renders them in a styled row
 * @param children - The children to be rendered inside the row
 * @returns - A styled row component with the children passed to it
 * The role is set to 'row' to indicate that this is a row in the table
 * The 'columns' prop is accessed from the 'context' to define the grid template columns
 */
const Row = ({ children }: { children: ReactNode }) => {
    const { columns } = useTableContext();
    return (
        <StyledRow role="row" columns={columns}>
            {children}
        </StyledRow>
    );
};
const Body = ({ children }) => {};

// assign
Table.Header = Header;
Table.Row = Row;
Table.Body = Body;
Table.Footer = Footer;
