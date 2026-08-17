import DashboardLayout from "../../features/dashboard/components/DashboardLayout";

// The "last N days" filter now lives in the Header's nav pill (see MainNav) instead of a
// row here, so this page is just the layout.
export function Dashboard() {
    return <DashboardLayout />;
}
