import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token;

        console.log('Middleware running for:', req.url);
        console.log('User role:', token?.role);
        console.log('User email:', token?.email);

        // Skip subscription check for admin users
        if (token?.role === "admin") {
            console.log('Skipping subscription check for admin user');
            return NextResponse.next();
        }

        // For non-admin users (including clinic_admins), check subscription status
        if (token?.email) {
            try {
                console.log('Checking subscription for user:', token.email);
                // Use absolute URL to avoid self-referencing issues in production
                const baseUrl = req.nextUrl.origin;
                const response = await fetch(`${baseUrl}/api/auth/check-subscription`, {
                    method: 'GET',
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                        'User-Agent': req.headers.get('user-agent') || '',
                    },
                });

                console.log('Subscription check response status:', response.status);

                if (!response.ok) {
                    console.log('Subscription check API failed, redirecting to signout');
                    // If the subscription check API fails, redirect to signout
                    const logoutUrl = new URL('/api/auth/signout', req.url);
                    const callbackUrl = `/api/auth/subscription-signout?error=subscription_inactive&message=${encodeURIComponent('Unable to verify subscription status. Please try again.')}`;
                    logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                    console.log('Redirecting to:', logoutUrl.toString());
                    return NextResponse.redirect(logoutUrl);
                }

                const data = await response.json();
                console.log('Subscription check result:', data);

                if (!data.success || !data.isValid) {
                    console.log('Subscription is inactive, redirecting to signout');
                    // Redirect to signout when subscription is inactive
                    const logoutUrl = new URL('/api/auth/signout', req.url);
                    const callbackUrl = `/api/auth/subscription-signout?error=subscription_inactive&message=${encodeURIComponent(data.message || 'Subscription is inactive')}`;
                    logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                    console.log('Redirecting to:', logoutUrl.toString());
                    return NextResponse.redirect(logoutUrl);
                }

                console.log('Subscription check passed, allowing request');
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, redirect to signout
                const logoutUrl = new URL('/api/auth/signout', req.url);
                const callbackUrl = `/api/auth/subscription-signout?error=subscription_inactive&message=${encodeURIComponent('Unable to verify subscription status. Please try again.')}`;
                logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                console.log('Redirecting to:', logoutUrl.toString());
                return NextResponse.redirect(logoutUrl);
            }
        } else {
            console.log('No user email found in token');
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