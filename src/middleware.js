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
                    // For API routes, return 401 instead of redirecting
                    if (req.nextUrl.pathname.startsWith('/api/')) {
                        return NextResponse.json(
                            {
                                success: false,
                                message: 'Unable to verify subscription status',
                                redirectTo: '/login?error=subscription_inactive&message=' + encodeURIComponent('Unable to verify subscription status. Please try again.')
                            },
                            { status: 401 }
                        );
                    }

                    // For page routes, redirect to login
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                    return NextResponse.redirect(loginUrl);
                }

                const data = await response.json();

                if (!data.success || !data.isValid) {
                    // For API routes, return 401 instead of redirecting
                    if (req.nextUrl.pathname.startsWith('/api/')) {
                        return NextResponse.json(
                            {
                                success: false,
                                message: 'Subscription inactive',
                                redirectTo: '/login?error=subscription_inactive&message=' + encodeURIComponent(data.message || 'Subscription is inactive')
                            },
                            { status: 401 }
                        );
                    }

                    // For page routes, redirect to login
                    const loginUrl = new URL('/login', req.url);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    return NextResponse.redirect(loginUrl);
                }
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, handle API routes differently
                if (req.nextUrl.pathname.startsWith('/api/')) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Unable to verify subscription status',
                            redirectTo: '/login?error=subscription_inactive&message=' + encodeURIComponent('Unable to verify subscription status. Please try again.')
                        },
                        { status: 401 }
                    );
                }

                // For page routes, redirect directly to login
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