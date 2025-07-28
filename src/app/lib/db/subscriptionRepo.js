import { sql } from './postgresql.js';

export const subscriptionRepo = {
    async createSubscriptionTier(clinicId, planId, subscriptionId = null) {
        try {
            const result = await sql`
                INSERT INTO "SubscriptionTier" ("clinicId", "planId", "subscriptionId", "startDate", "isActive")
                VALUES (${clinicId}, ${planId}, ${subscriptionId}, NOW(), true)
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

    async updateSubscriptionStatus(clinicId, isActive, subscriptionId = null, endDate = null) {
        try {
            const result = await sql`
                UPDATE "SubscriptionTier" 
                SET "isActive" = ${isActive}, 
                    "subscriptionId" = COALESCE(${subscriptionId}, "subscriptionId"),
                    "endDate" = COALESCE(${endDate}, "endDate"),
                    "updatedAt" = NOW()
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

    async getSubscriptionByGHLId(ghlSubscriptionId) {
        try {
            const result = await sql`
                SELECT * FROM "SubscriptionTier" 
                WHERE "subscriptionId" = ${ghlSubscriptionId}
                ORDER BY "createdAt" DESC 
                LIMIT 1
            `;
            return result[0] || null;
        } catch (error) {
            console.error('Error getting subscription by GHL ID:', error);
            throw error;
        }
    },

    async updateSubscriptionDates(clinicId, startDate, endDate) {
        try {
            const result = await sql`
                UPDATE "SubscriptionTier" 
                SET "startDate" = ${startDate}, 
                    "endDate" = ${endDate},
                    "updatedAt" = NOW()
                WHERE "clinicId" = ${clinicId}
                RETURNING *
            `;
            return result[0];
        } catch (error) {
            console.error('Error updating subscription dates:', error);
            throw error;
        }
    }
}; 