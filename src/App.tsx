import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";

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
