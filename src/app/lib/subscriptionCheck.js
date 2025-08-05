import { sql } from './db/postgresql.js';

export async function checkSubscriptionStatus(userId) {
    console.log("check subscription", userId);
    try {
        // First, get the user and their clinic ID
        const userResult = await sql`
      SELECT "clinic" FROM "User" 
      WHERE "id" = ${userId}
      LIMIT 1
    `;

        if (!userResult || userResult.length === 0) {
            return { isValid: false, message: "User not found" };
        }

        const user = userResult[0];

        // If user doesn't have a clinic (admin users), allow access
        if (!user.clinic) {
            return { isValid: true, message: "Admin user - no clinic restriction" };
        }

        // Get the subscription status for the clinic
        const subscriptionResult = await sql`
      SELECT "isActive" FROM "SubscriptionTier" 
      WHERE "clinicId" = ${user.clinic}
      ORDER BY "createdAt" DESC 
      LIMIT 1
    `;

        console.log("check subscription status:", subscriptionResult);

        if (!subscriptionResult || subscriptionResult.length === 0) {
            return { isValid: false, message: "No subscription found for this clinic" };
        }

        const subscription = subscriptionResult[0];

        if (subscription.isActive) {
            return { isValid: true, message: "Subscription is active" };
        } else {
            return { isValid: false, message: "Subscription is inactive" };
        }
    } catch (error) {
        console.error('Error checking subscription status:', error);
        return { isValid: false, message: "Error checking subscription status" };
    }
} 