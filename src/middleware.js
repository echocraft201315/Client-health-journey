import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;

        // Skip subscription check for admin users
        if (token?.role === "admin") {
            return NextResponse.next();
        }

        // For non-admin users, check subscription status
        if (token?.email) {
            try {
                const response = await fetch(`${req.nextUrl.origin}/api/auth/check-subscription`, {
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                    },
                });

                const data = await response.json();

                if (!data.success || !data.isValid) {
                    // Redirect to login with error message
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    console.log('Middleware redirecting to login with subscription error:', loginUrl.toString());
                    return NextResponse.redirect(loginUrl);
                }
            } catch (error) {
                console.error('Error checking subscription in middleware:', error);
                // On error, allow the request to proceed (fail open)
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/coach/:path*",
        "/client/:path*",
        "/clinic/:path*",
        "/api/activity/:path*",
        "/api/admin/:path*",
        "/api/client/:path*",
        "/api/clinic/:path*",
        "/api/coach/:path*",
        "/api/message/:path*",
        "/api/user/:path*"
    ]
}