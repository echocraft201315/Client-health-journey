import { sql } from './postgresql.js';

export const subscriptionRepo = {
    async createSubscriptionTier(clinicId, planId, subscriptionId = null, startDate, endDate, isActive) {
        try {
            const result = await sql`
                INSERT INTO "SubscriptionTier" ("clinicId", "planId", "subscriptionId", "startDate", "endDate", "isActive")
                VALUES (${clinicId}, ${planId}, ${subscriptionId}, ${startDate}, ${endDate}, ${isActive})
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error creating subscription tier:', error);
            throw error;
        }
    },

    async getSubscriptionTier(clinicId) {
        try {
            const result = await sql`
                SELECT * FROM "SubscriptionTier" 
                WHERE "clinicId" = ${clinicId}
                ORDER BY "createdAt" DESC 
                LIMIT 1
            `;
            return result[0] || null;
        } catch (error) {
            console.error('Error getting subscription tier:', error);
            throw error;
        }
    },

    async updateSubscriptionStatus(clinicId, planId, subscriptionId = null, startDate, endDate, isActive) {
        try {
            const result = await sql`
                UPDATE "SubscriptionTier" 
                SET "planId" = ${planId}, 
                    "subscriptionId" = COALESCE(${subscriptionId}, "subscriptionId"),
                    "startDate" = COALESCE(${startDate}, "startDate"),
                    "endDate" = COALESCE(${endDate}, "endDate"),
                    "isActive" = COALESCE(${isActive}, "isActive")  
                WHERE "clinicId" = ${clinicId}
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error updating subscription status:', error);
            throw error;
        }
    },

    async createSubscriptionHistory(clinicId, subscriptionTierId, paymentAmount) {
        try {
            const result = await sql`
                INSERT INTO "SubscriptionHistory" ("clinicId", "subscriptionId", "paymentAmount")
                VALUES (${clinicId}, ${subscriptionTierId}, ${paymentAmount})
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error creating subscription history:', error);
            throw error;
        }
    },

    async getSubscriptionHistory() {
        try {
            const result = await sql`
                SELECT sh.*, st."planId", c."name" as "clinicName"
                FROM "SubscriptionHistory" sh
                JOIN "SubscriptionTier" st ON sh."subscriptionId" = st."id"
                JOIN "Clinic" c ON sh."clinicId" = c."id"
                ORDER BY sh."createdAt" DESC
            `;
            return result;
        } catch (error) {
            console.error('Error getting subscription history:', error);
            throw error;
        }
    },

    async cancelSubscriptionStatus(clinicId, isActive, subscriptionId, endDate) {
        try {
            const result = await sql`
                UPDATE "SubscriptionTier" 
                SET "isActive" = ${isActive}, 
                    "endDate" = ${endDate}
                WHERE "clinicId" = ${clinicId} AND "subscriptionId" = ${subscriptionId}
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error canceling subscription status:', error);
            throw error;
        }
    },

    async renewalSubscriptionStatus(clinicId, isActive, subscriptionId, newEndDate) {
        try {
            const result = await sql`
                UPDATE "SubscriptionTier" 
                SET "isActive" = ${isActive}, 
                    "endDate" = ${newEndDate}
                WHERE "clinicId" = ${clinicId} AND "subscriptionId" = ${subscriptionId}
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error renewing subscription status:', error);
            throw error;
        }
    }
}; 