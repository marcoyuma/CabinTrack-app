import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import { AppLayout } from "./ui/AppLayout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Bookings from "./pages/Bookings/Bookings";
import Cabins from "./pages/Cabins/Cabins";
import { Users } from "./pages/Users/Users";
import Settings from "./pages/Settings/Settings";
import Account from "./pages/Account/Account";
import Login from "./pages/Login/Login";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

export const App = () => {
    const router = createBrowserRouter([
        {
            element: <AppLayout />,
            children: [
                { index: true, element: <Navigate replace to="dashboard" /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "bookings", element: <Bookings /> },
                { path: "cabins", element: <Cabins /> },
                { path: "users", element: <Users /> },
                { path: "settings", element: <Settings /> },
                { path: "account", element: <Account /> },
                { path: "login", element: <Login /> },
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
