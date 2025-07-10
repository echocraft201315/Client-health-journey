import { sql } from "./postgresql";

async function getClientProfileByClientId(clientId) {
    const result = await sql`
    SELECT * FROM "ClientProfile" WHERE "clientId" = ${clientId} LIMIT 1
  `;
    return result[0] || null;
}

async function createClientProfile(clientId, profileData, healthConditions, customRequests, coachingPrefs) {
    const result = await sql`
    INSERT INTO "ClientProfile" ("clientId", "profileData", "healthConditions", "customRequests", "coachingPrefs")
    VALUES (${clientId}, ${JSON.stringify(profileData)}, ${JSON.stringify(healthConditions)}, ${JSON.stringify(customRequests)}, ${JSON.stringify(coachingPrefs)})
    RETURNING *
  `;
    return result[0];
}

async function updateClientProfile(clientId, profileData, healthConditions, customRequests, coachingPrefs) {
    const result = await sql`
    UPDATE "ClientProfile"
    SET "profileData" = ${JSON.stringify(profileData)},
        "healthConditions" = ${JSON.stringify(healthConditions)},
        "customRequests" = ${JSON.stringify(customRequests)},
        "coachingPrefs" = ${JSON.stringify(coachingPrefs)}
    WHERE "clientId" = ${clientId}
    RETURNING *
  `;
    return result[0];
}

async function deleteClientProfile(clientId) {
    await sql`
    DELETE FROM "ClientProfile" WHERE "clientId" = ${clientId}
  `;
    return true;
}

export const clientProfileRepo = {
    getClientProfileByClientId,
    createClientProfile,
    updateClientProfile,
    deleteClientProfile,
}; 