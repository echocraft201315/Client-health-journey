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

                if (!response.ok) {
                    // If the subscription check API fails, redirect to login and clear session
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');

                    const response = NextResponse.redirect(loginUrl);

                    // Clear session cookies
                    response.cookies.delete('next-auth.session-token');
                    response.cookies.delete('__Secure-next-auth.session-token');
                    response.cookies.delete('next-auth.csrf-token');
                    response.cookies.delete('__Host-next-auth.csrf-token');
                    response.cookies.delete('next-auth.callback-url');
                    response.cookies.delete('__Secure-next-auth.callback-url');

                    return response;
                }

                const data = await response.json();

                if (!data.success || !data.isValid) {
                    // Redirect to login and clear session when subscription is inactive
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');

                    const response = NextResponse.redirect(loginUrl);

                    // Clear session cookies
                    response.cookies.delete('next-auth.session-token');
                    response.cookies.delete('__Secure-next-auth.session-token');
                    response.cookies.delete('next-auth.csrf-token');
                    response.cookies.delete('__Host-next-auth.csrf-token');
                    response.cookies.delete('next-auth.callback-url');
                    response.cookies.delete('__Secure-next-auth.callback-url');

                    return response;
                }
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, redirect to login and clear session
                const loginUrl = new URL('/login', req.url);
                loginUrl.searchParams.set('error', 'subscription_inactive');
                loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');

                const response = NextResponse.redirect(loginUrl);

                // Clear session cookies
                response.cookies.delete('next-auth.session-token');
                response.cookies.delete('__Secure-next-auth.session-token');
                response.cookies.delete('next-auth.csrf-token');
                response.cookies.delete('__Host-next-auth.csrf-token');
                response.cookies.delete('next-auth.callback-url');
                response.cookies.delete('__Secure-next-auth.callback-url');

                return response;
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