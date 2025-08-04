import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;

        // Skip subscription check for admin users
        if (token?.role === "admin") {
            return NextResponse.next();
        }

        // For non-admin users (including clinic_admins), check subscription status
        if (token?.email) {
            try {
                // Use absolute URL to avoid self-referencing issues in production
                const baseUrl = req.nextUrl.origin;
                const response = await fetch(`${baseUrl}/api/auth/check-subscription`, {
                    method: 'GET',
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                        'User-Agent': req.headers.get('user-agent') || '',
                    },
                });
                console.log('Subscription check response:', response);
                if (!response.ok) {
                    // If the subscription check API fails, redirect directly to login with error
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                    return NextResponse.redirect(loginUrl);
                }

                const data = await response.json();
                console.log('Subscription check data:', data);
                if (!data.success || !data.isValid) {
                    // Redirect directly to login with error when subscription is inactive
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    return NextResponse.redirect(loginUrl);
                }
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, redirect directly to login
                const loginUrl = new URL('/login', req.url);
                loginUrl.searchParams.set('error', 'subscription_inactive');
                loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                return NextResponse.redirect(loginUrl);
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