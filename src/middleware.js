import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        console.log('=== MIDDLEWARE TRIGGERED ===');
        console.log('Path:', req.nextUrl.pathname);
        console.log('Method:', req.method);
        console.log('Origin:', req.nextUrl.origin);
        console.log('Actual URL:', req.url);
        console.log('Headers host:', req.headers.get('host'));
        console.log('X-Forwarded-Host:', req.headers.get('x-forwarded-host'));
        console.log('X-Forwarded-Proto:', req.headers.get('x-forwarded-proto'));

        const token = req.nextauth.token;
        console.log('Token exists:', !!token);
        console.log('Token role:', token?.role);
        console.log('Token email:', token?.email);

        // Skip subscription check for admin users
        if (token?.role === "admin") {
            console.log('Skipping subscription check for admin user');
            return NextResponse.next();
        }

        // For non-admin users (including clinic_admins), check subscription status
        if (token?.email) {
            console.log('Checking subscription for user:', token.email);
            try {
                // Construct the correct base URL for production
                const protocol = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol || 'https');
                const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname;
                const baseUrl = `${protocol}://${host}`;
                const checkUrl = `${baseUrl}/api/auth/check-subscription`;
                console.log('Making request to:', checkUrl);

                const response = await fetch(checkUrl, {
                    method: 'GET',
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                        'User-Agent': req.headers.get('user-agent') || '',
                    },
                });

                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    console.log('Response not ok - redirecting to login');
                    // If the subscription check API fails, redirect directly to login with error
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                    console.log('Redirecting to:', loginUrl.toString());
                    return NextResponse.redirect(loginUrl);
                }

                const data = await response.json();
                console.log('Response data:', data);
                console.log('Data success:', data.success);
                console.log('Data isValid:', data.isValid);
                console.log('Condition check (!data.success || !data.isValid):', !data.success || !data.isValid);

                if (!data.success || !data.isValid) {
                    console.log('Subscription invalid - redirecting to login');
                    // Redirect directly to login with error when subscription is inactive
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    console.log('Redirecting to:', loginUrl.toString());
                    return NextResponse.redirect(loginUrl);
                }

                console.log('Subscription is valid - continuing');
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                console.log('Error message:', error.message);
                console.log('Error stack:', error.stack);
                // On error, redirect directly to login
                const loginUrl = new URL('/login', req.url);
                loginUrl.searchParams.set('error', 'subscription_inactive');
                loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                console.log('Error redirecting to:', loginUrl.toString());
                return NextResponse.redirect(loginUrl);
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