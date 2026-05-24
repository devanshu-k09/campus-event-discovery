import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Skip static files, Next.js internal files, and APIs to prevent recursion/performance issues
        if (
            path.startsWith("/_next") ||
            path.startsWith("/api") ||
            path.includes(".") ||
            path === "/favicon.ico"
        ) {
            return NextResponse.next();
        }

        // Set x-pathname header so it is available in Server Components (like RootLayout)
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-pathname", path);

        // Read maintenance mode from cookie to avoid deadlock-inducing local fetch calls
        const maintenanceMode = req.cookies.get("maintenance_mode")?.value === "true";

        // 1. If maintenance mode is active
        if (maintenanceMode) {
            const isAdminRoute = path.startsWith("/admin");
            const isMaintenancePage = path === "/maintenance";
            const isAdminUser = token?.role === "admin";

            // Redirect non-admins to maintenance page
            if (!isAdminRoute && !isMaintenancePage && !isAdminUser) {
                return NextResponse.redirect(new URL("/maintenance", req.url));
            }
            
            // Allow admin routes, maintenance page, or admin users
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            });
        }

        // 2. If maintenance mode is not active
        if (path === "/maintenance") {
            // Redirect to home if someone manually goes to /maintenance when it is off
            return NextResponse.redirect(new URL("/", req.url));
        }

        // 3. Admin Route protection
        const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";
        if (isAdminRoute) {
            if (!token) {
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }
            if (token.role !== "admin") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        });
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                
                // Allow public access to admin routes (handled in middleware function manually)
                if (path.startsWith("/admin") || path === "/maintenance") {
                    return true;
                }

                // Identify if it's a user protected route
                const isUserProtectedRoute = 
                    path.startsWith("/dashboard") ||
                    path.startsWith("/organizer") ||
                    path === "/create-event" ||
                    (path.startsWith("/events/") && path.endsWith("/register"));

                if (isUserProtectedRoute) {
                    return !!token;
                }

                // All other routes (e.g. /, /events, etc.) are public
                return true;
            },
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    // Match all page routes except static files, favicons, next internals, and APIs
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
