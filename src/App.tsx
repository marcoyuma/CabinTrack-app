import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import { AppLayout } from "./ui/AppLayout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Bookings from "./pages/Bookings/Bookings";
import Cabins from "./pages/Cabins/Cabins/Cabins";
import { Users } from "./pages/Users/Users";
import Settings from "./pages/Settings/Settings";
import Account from "./pages/Account/Account";
import Login from "./pages/Login/Login";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

export const App = () => {
    // define react-query instance
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                //  staleTime: 60 * 1000
                staleTime: 0,
            },
        },
    });

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
        // wrap up our provider with query client provider
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <GlobalStyles />
            <RouterProvider router={router} />
            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: "8px" }}
                toastOptions={{
                    success: {
                        duration: 3000,
                    },
                    error: { duration: 5000 },
                    style: {
                        fontSize: "16px",
                        maxWidth: "500px",
                        padding: "16px 24px",
                        backgroundColor: "var(--color-grey-0)",
                        color: "var(--color-grey-700)",
                    },
                }}
            />
        </QueryClientProvider>
    );
};
