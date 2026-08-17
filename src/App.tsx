import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppLayout } from "./ui/AppLayout/AppLayout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Account } from "./pages/Account/Account";
import { Login } from "./pages/Login/Login";
import { PageNotFound } from "./pages/PageNotFound/PageNotFound";

import { Checkin } from "./pages/Checkin/Checkin";
import { Stays } from "./pages/Stays/Stays";
import { Bookings } from "./pages/Bookings/Bookings";
import { ProtectedRoute } from "./ui/ProtectedRoute/ProtectedRoute";
import { StaffOnlyRoute } from "./ui/StaffOnlyRoute/StaffOnlyRoute";
import { ErrorFallback } from "./ui/ErrorFallback/ErrorFallback";

export function App() {
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
        // private routes
        {
            element: (
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            ),
            errorElement: <ErrorFallback />,
            children: [
                { index: true, element: <Navigate replace to="dashboard" /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "checkin/:bookingId", element: <Checkin /> },
                { path: "account", element: <Account /> },
                {
                    path: "stays",
                    element: (
                        <StaffOnlyRoute>
                            <Stays />
                        </StaffOnlyRoute>
                    ),
                },
                {
                    path: "bookings",
                    element: (
                        <StaffOnlyRoute>
                            <Bookings />
                        </StaffOnlyRoute>
                    ),
                },
            ],
        },
        // public route
        { path: "login", element: <Login /> },
        // fallback
        { path: "*", element: <PageNotFound /> },
        // path opened as soon as the app is open then directly navigate to 'dashboard' path
    ]);
    return (
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
}
