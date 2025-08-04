import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/lib/authoption';
import { checkSubscriptionStatus } from '@/app/lib/subscriptionCheck';
import { userRepo } from '@/app/lib/db/userRepo';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        // Get user data from database using email
        const user = await userRepo.getUserByEmail(session.user.email);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const subscriptionCheck = await checkSubscriptionStatus(user.id);

        return NextResponse.json({
            success: true,
            isValid: subscriptionCheck.isValid,
            message: subscriptionCheck.message
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
} 