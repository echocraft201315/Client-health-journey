import { sql } from "./postgresql";

async function getActivities(id) {
  const activities = await sql`
    SELECT * FROM "Activity" WHERE "clinicId" = ${id}
  `;
  return activities;
}

async function createActivity(type, description, clinicId) {
  const [activity] = await sql`
    INSERT INTO "Activity" ("type", "description", "clinicId")
    VALUES (${type}, ${description}, ${clinicId})
    RETURNING *
  `;
  return activity;
}

async function updateclientActivity(email) {
  const currentTime = new Date();

  const [updatedClient] = await sql`
    UPDATE "Client"
    SET "lastCheckIn" = ${currentTime}
    WHERE "email" = ${email}
    RETURNING *
  `;

  return updatedClient || null;
}

export const activityRepo = {
  getActivities,
  createActivity,
  updateclientActivity,
};
