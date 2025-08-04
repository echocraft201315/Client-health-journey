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
                const response = await fetch(`${req.nextUrl.origin}/api/auth/check-subscription`, {
                    headers: {
                        'Cookie': req.headers.get('cookie') || '',
                    },
                });

                const data = await response.json();

                if (!data.success || !data.isValid) {
                    // For API routes, return error response instead of redirect
                    if (req.nextUrl.pathname.startsWith('/api/')) {
                        console.log('API route detected, returning error response');
                        return NextResponse.json(
                            {
                                success: false,
                                message: 'Subscription is inactive',
                                redirect: true,
                                redirectUrl: '/login?error=subscription_inactive&message=' + encodeURIComponent(data.message || 'Subscription is inactive')
                            },
                            { status: 403 }
                        );
                    }

                    // For page routes, redirect to login
                    const baseUrl = req.nextUrl.origin;
                    const loginUrl = new URL('/login', baseUrl);
                    loginUrl.searchParams.set('error', 'subscription_inactive');
                    loginUrl.searchParams.set('message', data.message || 'Subscription is inactive');
                    console.log('Middleware redirecting to login with subscription error:', loginUrl.toString());
                    return NextResponse.redirect(loginUrl, 302);
                }
            } catch (error) {
                console.log('Error checking subscription in middleware:', error);
                // On error, redirect to login instead of allowing the request to proceed

                // For API routes, return error response instead of redirect
                if (req.nextUrl.pathname.startsWith('/api/')) {
                    console.log('API route detected, returning error response for catch block');
                    return NextResponse.json(
                        {
                            success: false,
                            message: 'Unable to verify subscription status. Please try again.',
                            redirect: true,
                            redirectUrl: '/login?error=subscription_inactive&message=' + encodeURIComponent('Unable to verify subscription status. Please try again.')
                        },
                        { status: 403 }
                    );
                }

                // For page routes, redirect to login
                const baseUrl = req.nextUrl.origin;
                const loginUrl = new URL('/login', baseUrl);
                loginUrl.searchParams.set('error', 'subscription_inactive');
                loginUrl.searchParams.set('message', 'Unable to verify subscription status. Please try again.');
                console.log('Middleware redirecting to login due to subscription check error:', loginUrl.toString());
                return NextResponse.redirect(loginUrl, 302);
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