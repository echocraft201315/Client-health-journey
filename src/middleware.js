import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        console.log('=== MIDDLEWARE TRIGGERED ===');
        console.log('Path:', req.nextUrl.pathname);

        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Skip subscription check for admin users
        if (token?.role === "admin") {
            console.log('Skipping subscription check for admin user');
            return NextResponse.next();
        }

        // For non-admin users (including clinic_admins), check subscription status
        if (token?.email && !path.startsWith("/api")) {
            console.log('Checking subscription for user:', token.email);
            try {
                // Use a simpler approach that works reliably
                const baseUrl = process.env.NODE_ENV === 'production'
                    ? 'https://app.clienthealthtracker.com'
                    : req.nextUrl.origin;
                const checkUrl = `${baseUrl}/api/auth/check-subscription`;
                console.log('Making request to:', checkUrl);

                const response = await fetch(checkUrl, {
                    method: 'GET',
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                        'User-Agent': req.headers.get('user-agent') || '',
                    },
                });

                const data = await response.json();
                console.log('Response data:', data);
                // console.log('Data success:', data.success);
                // console.log('Data isValid:', data.isValid);
                // console.log('Condition check (!data.success || !data.isValid):', !data.success || !data.isValid);

                if (!data.success || !data.isValid) {
                    // console.log('Subscription invalid - redirecting to login');
                    // Redirect directly to login with error when subscription is inactive
                    const loginUrl = new URL('/login', baseUrl);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    console.log('Redirecting to:', loginUrl.toString());

                    // Create response with cleared cookies
                    const response = NextResponse.redirect(loginUrl, 302);

                    // Clear NextAuth session cookies
                    response.cookies.delete('next-auth.session-token');
                    response.cookies.delete('__Secure-next-auth.session-token');
                    response.cookies.delete('next-auth.csrf-token');
                    response.cookies.delete('__Host-next-auth.csrf-token');
                    response.cookies.delete('next-auth.callback-url');
                    response.cookies.delete('__Secure-next-auth.callback-url');

                    return response;
                }

                console.log('Subscription is valid - continuing');
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                console.log('Error message:', error.message);
                console.log('Error stack:', error.stack);
                // On error, redirect directly to login
                const baseUrl = process.env.NODE_ENV === 'production'
                    ? 'https://app.clienthealthtracker.com'
                    : req.nextUrl.origin;
                const loginUrl = new URL('/login', baseUrl);
                loginUrl.searchParams.set('error', 'subscription_inactive');
                loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                console.log('Error redirecting to:', loginUrl.toString());

                // Create response with cleared cookies
                const response = NextResponse.redirect(loginUrl, 302);

                // Clear NextAuth session cookies
                response.cookies.delete('next-auth.session-token');
                response.cookies.delete('__Secure-next-auth.session-token');
                response.cookies.delete('next-auth.csrf-token');
                response.cookies.delete('__Host-next-auth.csrf-token');
                response.cookies.delete('next-auth.callback-url');
                response.cookies.delete('__Secure-next-auth.callback-url');

                return response;
            }
        } else {
            console.log('No token email found');
        }

        console.log('Middleware completed - continuing to next');
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