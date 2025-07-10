import { sql } from './postgresql';

async function createSubscriptionTier(clinicId, planId, customerId) {
  const existing = await sql`
    SELECT * FROM "SubscriptionTier" WHERE "clinicId" = ${clinicId} LIMIT 1
  `;
  if (existing.length > 0) {
    return existing[0];
  }

  const [subscriptionTier] = await sql`
    INSERT INTO "SubscriptionTier" ("clinicId", "planId", "customerId", "isActive")
    VALUES (${clinicId}, ${planId}, ${customerId}, false)
    RETURNING *
  `;
  return subscriptionTier;
}

async function createSubscriptionHistory(clinicId, subscriptionId, paymentAmount) {
  const existing = await sql`
    SELECT * FROM "SubscriptionHistory" WHERE "subscriptionId" = ${subscriptionId} LIMIT 1
  `;
  if (existing.length > 0) {
    return existing[0];
  }

  const [subscriptionHistory] = await sql`
    INSERT INTO "SubscriptionHistory" ("clinicId", "subscriptionId", "paymentAmount")
    VALUES (${clinicId}, ${subscriptionId}, ${paymentAmount})
    RETURNING *
  `;
  return subscriptionHistory;
}

async function subscriptionActive(clinicId, { isActive, subscriptionId }) {
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
  const [updated] = await sql`
    UPDATE "SubscriptionTier"
    SET "isActive" = ${isActive},
        "subscriptionId" = ${subscriptionId},
        "startDate" = ${startDate},
        "endDate" = ${endDate}
    WHERE "clinicId" = ${clinicId}
    RETURNING *
  `;
  return updated || null;
}

async function getSubscriptionTier(clinicId) {
  const result = await sql`
    SELECT * FROM "SubscriptionTier" WHERE "clinicId" = ${clinicId} LIMIT 1
  `;
  return result[0] || null;
}

async function deleteSubscriptionTier(id) {
  await sql`
    DELETE FROM "SubscriptionTier" WHERE "id" = ${id}
  `;
}

async function updateSubscriptionTier(clinicId, planId) {
  const [updated] = await sql`
    UPDATE "SubscriptionTier"
    SET "planId" = ${planId},
        "isActive" = false
    WHERE "clinicId" = ${clinicId}
    RETURNING *
  `;
  return updated || null;
}

async function getSubscriptionTierByCustomerId(customerId) {
  const result = await sql`
    SELECT * FROM "SubscriptionTier" WHERE "customerId" = ${customerId} LIMIT 1
  `;
  return result[0] || null;
}

async function deleteSessionByClinicId(clinicId) {
  await sql`
    DELETE FROM "SubscriptionTier" WHERE "clinicId" = ${clinicId}
  `;
}

async function getSubscriptionHistory() {
  return await sql`SELECT * FROM "SubscriptionHistory"`;
}

async function activeSubscriptionTier(id, planId, isActive) {
  const [updated] = await sql`
    UPDATE "SubscriptionTier"
    SET "planId" = ${planId},
        "isActive" = ${isActive}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated || null;
}

export const subscriptionRepo = {
  createSubscriptionTier,
  createSubscriptionHistory,
  subscriptionActive,
  getSubscriptionTier,
  deleteSubscriptionTier,
  updateSubscriptionTier,
  deleteSessionByClinicId,
  getSubscriptionTierByCustomerId,
  getSubscriptionHistory,
  activeSubscriptionTier,
};
