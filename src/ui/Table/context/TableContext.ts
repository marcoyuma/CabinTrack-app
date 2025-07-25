import { createContext } from "react";

// TableContext is a context that provides the 'columns' prop to its children components
// This allows child components to access the 'columns' prop without passing it down manually
export const TableContext = createContext<{ columns: string } | null>(null);
