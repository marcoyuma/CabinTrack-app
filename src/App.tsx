import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import Dashboard from "../../starter/temp/pages/Dashboard";
import Account from "../../starter/temp/pages/Account";
import Bookings from "../../starter/temp/pages/Bookings";
import Login from "../../starter/temp/pages/Login";
import Settings from "../../starter/temp/pages/Settings";
import { Users } from "../../starter/temp/pages/Users";
import PageNotFound from "../../starter/temp/pages/PageNotFound";
import GlobalStyles from "../../starter/temp/styles/GlobalStyles";
import { AppLayout } from "../../starter/temp/ui/AppLayout/AppLayout";

export const App = () => {
    const router = createBrowserRouter([
        {
            element: <AppLayout />,
            children: [
                { index: true, element: <Navigate replace to="dashboard" /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "account", element: <Account /> },
                { path: "bookings", element: <Bookings /> },
                { path: "settings", element: <Settings /> },
                { path: "users", element: <Users /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "dashboard", element: <Dashboard /> },
            ],
        },
        { path: "login", element: <Login /> },
        { path: "*", element: <PageNotFound /> },
        // path opened as soon as the app is open then directly navigate to 'dashboard' path
    ]);
    return (
        <>
            <GlobalStyles />
            <RouterProvider router={router} />
        </>
    );
};
