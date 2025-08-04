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
                    // If the subscription check API fails, redirect to signout
                    const logoutUrl = new URL('/api/auth/signout', req.url);
                    const callbackUrl = `/login?error=subscription_inactive&message=${encodeURIComponent('Unable to verify subscription status. Please try again.')}`;
                    logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                    return NextResponse.redirect(logoutUrl);
                }

                const data = await response.json();

                if (!data.success || !data.isValid) {
                    // Redirect to signout when subscription is inactive
                    const logoutUrl = new URL('/api/auth/signout', req.url);
                    const callbackUrl = `/login?error=subscription_inactive&message=${encodeURIComponent(data.message || 'Subscription is inactive')}`;
                    logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                    return NextResponse.redirect(logoutUrl);
                }
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, redirect to signout
                const logoutUrl = new URL('/api/auth/signout', req.url);
                const callbackUrl = `/login?error=subscription_inactive&message=${encodeURIComponent('Unable to verify subscription status. Please try again.')}`;
                logoutUrl.searchParams.set('callbackUrl', callbackUrl);
                return NextResponse.redirect(logoutUrl);
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