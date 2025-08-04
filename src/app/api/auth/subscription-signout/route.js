import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authoption';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const error = searchParams.get('error');
        const message = searchParams.get('message');

        console.log('Subscription signout API called with:', { error, message });

        // Get the current session
        const session = await getServerSession(authOptions);

        if (session) {
            console.log('User session found, clearing session...');
            // The session will be cleared by NextAuth when redirecting
        }

        // Redirect to login with error parameters
        const loginUrl = new URL('/login', request.url);
        if (error) {
            loginUrl.searchParams.set('error', error);
        }
        if (message) {
            loginUrl.searchParams.set('message', message);
        }

        console.log('Redirecting to login with error:', loginUrl.toString());

        // Set a cookie to indicate this was a subscription-related logout
        const response = NextResponse.redirect(loginUrl);
        response.cookies.set('subscription_logout', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 // 1 minute
        });

        return response;
    } catch (error) {
        console.error('Error in subscription signout:', error);
        // Fallback redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'subscription_inactive');
        loginUrl.searchParams.set('message', 'An error occurred during signout');
        return NextResponse.redirect(loginUrl);
    }
} 