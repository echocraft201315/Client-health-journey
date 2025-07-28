import { sql } from "./postgresql";
import { SubscriptionPlan } from "../stack";

async function createClinic(
  email,
  name,
  phoneNumber,
  options = {}
) {
  const existingClinic = await sql`
    SELECT * FROM "Clinic" WHERE "email" = ${email} LIMIT 1
  `;
  if (existingClinic.length > 0) {
    return existingClinic[0];
  }

  const [newClinic] = await sql`
    INSERT INTO "Clinic" (
      "email", "name", "phoneNumber", "primaryContact", "streetAddress",
      "city", "state", "zipCode", "addOns", "hipaaAcknowledgment",
      "legalAcknowledgment"
    ) VALUES (
      ${email}, ${name}, ${phoneNumber}, ${primaryContact}, ${streetAddress},
      ${city}, ${state}, ${zipCode}, ${addOns}, ${hipaaAcknowledgment},
      ${legalAcknowledgment}
    )
    RETURNING *
  `;

  return newClinic;
}

async function getCheckIns() {
  return await sql`SELECT * FROM "CheckIn"`;
}

async function getClinicById(id) {
  const clinic = await sql`SELECT * FROM "Clinic" WHERE "id" = ${id} LIMIT 1`;
  return clinic[0] || null;
}

async function getCheckInsbyId(id) {
  return await sql`SELECT * FROM "CheckIn" WHERE "clinic" = ${id}`;
}

async function deleteClinic(id) {
  await sql`DELETE FROM "Clinic" WHERE "id" = ${id}`;
}

async function getnumcoachesbyId(coachId) {
  const clients = await sql`SELECT * FROM "Client" WHERE "coachId" = ${coachId}`;
  return clients;
}

async function getNumWactiveCount(clinicId) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await sql`
      SELECT COUNT(*)::int AS "pastWeekCount"
      FROM "Activity"
      WHERE "clinicId" = ${clinicId} AND "timeStamp" >= ${oneWeekAgo}
    `;
    return result[0]?.pastWeekCount || 0;
  } catch (error) {
    console.error('[ActivityStats] Error fetching past week activity count:', error);
    return 0;
  }
}

async function getNumWeeklyActivities() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await sql`
      SELECT COUNT(*)::int AS "pastWeekCount"
      FROM "Activity"
      WHERE "timeStamp" >= ${oneWeekAgo}
    `;

    return result[0]?.pastWeekCount || 0;
  } catch (error) {
    console.error('[ActivityStats] Error fetching past week activity count:', error);
    return 0;
  }
}

async function getRecentactivity(clinicId) {
  return await sql`
    SELECT * FROM "Activity"
    WHERE "clinicId" = ${clinicId}
    ORDER BY "timeStamp" DESC
  `;
}

async function getAllRecentactivity() {
  return await sql`
    SELECT * FROM "Activity"
    ORDER BY "timeStamp" DESC
  `;
}

async function fetchRevenueData(clinicId) {
  try {
    const revenueData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });

      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      let query;
      if (clinicId) {
        query = sql`
          SELECT COUNT(*) AS checkInCount, COUNT(DISTINCT "email") AS uniqueClientCount
          FROM "CheckIn"
          WHERE "selectedDate" >= ${startDate} AND "selectedDate" <= ${endDate} AND "clinic" = ${clinicId}
        `;
      } else {
        query = sql`
          SELECT COUNT(*) AS checkInCount, COUNT(DISTINCT "email") AS uniqueClientCount
          FROM "CheckIn"
          WHERE "selectedDate" >= ${startDate} AND "selectedDate" <= ${endDate}
        `;
      }

      const [result] = await query;

      const revenue = (result?.checkInCount || 0) * 100;

      revenueData.push({
        month: monthName,
        revenue,
        clients: Number(result?.uniqueClientCount || 0),
      });
    }

    return revenueData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}

async function fetchAllRevenueData() {
  try {
    const revenueData = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });

      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const result = await sql`
        SELECT
          COUNT(*) AS checkInCount,
          COUNT(DISTINCT "email") AS uniqueClientCount
        FROM "CheckIn"
        WHERE "selectedDate" >= ${startDate} AND "selectedDate" <= ${endDate}
      `;

      const row = result[0];
      const revenue = (row?.checkInCount || 0) * 100;

      revenueData.push({
        month: monthName,
        revenue,
        clients: Number(row?.uniqueClientCount || 0),
      });
    }

    console.log("revenueData", revenueData);
    return revenueData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}

async function fetchsubscriptionData(clinicId) {
  try {
    // Fetch clinic
    const clinics = await sql`SELECT * FROM "Clinic" WHERE "id" = ${clinicId}`;
    if (clinics.length === 0) return [];

    const clinic = clinics[0];

    // Count unique clients for this clinic
    const clientCountResult = await sql`
      SELECT COUNT(DISTINCT "email") AS clientCount
      FROM "CheckIn"
      WHERE "clinic" = ${clinicId}
    `;
    const clientCount = Number(clientCountResult[0]?.clientCount || 0);

    // Fetch subscription tier for this clinic
    const subscriptionTiers = await sql`
      SELECT * FROM "SubscriptionTier" WHERE "clinicId" = ${clinicId} LIMIT 1
    `;
    const subscriptionTier = subscriptionTiers[0] || {};
    const plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
    const price = plan?.price || 'N/A';

    return [{
      id: clinic.id,
      name: clinic.name,
      plan: subscriptionTier.planId || 'N/A',
      price,
      startDate: subscriptionTier.startDate || 'N/A',
      clients: clientCount
    }];
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
}

async function fetchAllsubscriptionData() {
  try {
    const clinics = await sql`SELECT * FROM "Clinic"`;

    const subscriptionData = [];

    for (const clinic of clinics) {
      const clientCountResult = await sql`
        SELECT COUNT(DISTINCT "email") AS "clientCount"
        FROM "CheckIn"
        WHERE "clinic" = ${clinic.id}
      `;
      const clientCount = Number(clientCountResult[0]?.clientCount || 0);

      const subscriptionTiers = await sql`
        SELECT * FROM "SubscriptionTier" WHERE "clinicId" = ${clinic.id} LIMIT 1
      `;
      const subscriptionTier = subscriptionTiers[0] || {};
      const plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
      const price = plan?.price || 'N/A';

      subscriptionData.push({
        id: clinic.id,
        name: clinic.name,
        plan: subscriptionTier.planId || 'N/A',
        price,
        startDate: subscriptionTier.startDate || 'N/A',
        clients: clientCount
      });
    }

    return subscriptionData;
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
}

async function getAllClinics() {
  try {
    const clinics = await sql`SELECT * FROM "Clinic" ORDER BY "createdAt" DESC`;
    return clinics;
  } catch (error) {
    console.error('Error fetching all clinics:', error);
    throw error;
  }
}

async function fetchTotalRevenue(clinicId) {
  try {
    let result;
    if (clinicId) {
      result = await sql`
        SELECT COUNT(*) AS count FROM "CheckIn" WHERE "clinic" = ${clinicId}
      `;
    } else {
      result = await sql`
        SELECT COUNT(*) AS count FROM "CheckIn"
      `;
    }
    const count = Number(result[0]?.count || 0);
    return count * 100;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
}

async function fetchAllTotalRevenue() {
  try {
    const result = await sql`
      SELECT COUNT(*) AS count FROM "CheckIn"
    `;
    const count = Number(result[0]?.count || 0);
    return count * 100;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
}

async function updateClinic(id, clinic) {
  const fields = {
    email: clinic.clinicEmail,
    name: clinic.clinicName,
    phoneNumber: clinic.clinicPhone,
    primaryContact: clinic.primaryContact,
    streetAddress: clinic.streetAddress,
    city: clinic.city,
    state: clinic.state,
    zipCode: clinic.zipCode,
    addOns: clinic.addOns,
    hipaaAcknowledgment: clinic.hipaaAcknowledgment,
    legalAcknowledgment: clinic.legalAcknowledgment,
  };
  const updated = await sql`
    UPDATE "Clinic"
    SET
    "email" = ${fields.email},
    "name" = ${fields.name},
    "phoneNumber" = ${fields.phoneNumber},
    "primaryContact" = ${fields.primaryContact},
    "streetAddress" = ${fields.streetAddress},
    "city" = ${fields.city},
    "state" = ${fields.state},
    "zipCode" = ${fields.zipCode},
    "addOns" = ${fields.addOns},
    "hipaaAcknowledgment" = ${fields.hipaaAcknowledgment},
    "legalAcknowledgment" = ${fields.legalAcknowledgment}
    WHERE "id" = ${id}
    RETURNING *
  `;

  return updated[0] || null;
}

async function updateClinicSubscription(id, subscriptionTier) {
  const updated = await sql`
    UPDATE "Clinic"
    SET "subscriptionTier" = ${subscriptionTier}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated[0] || null;
}

async function getClinicByEmail(email) {
  const clinic = await sql`
    SELECT * FROM "Clinic" WHERE "email" = ${email} LIMIT 1
  `;
  return clinic[0] || null;
}

async function getClinicByGHLContactId(ghlContactId) {
  const clinic = await sql`
    SELECT * FROM "Clinic" WHERE "ghlContactId" = ${ghlContactId} LIMIT 1
  `;
  return clinic[0] || null;
}

async function updateClinicGHLContactId(clinicId, ghlContactId) {
  const updated = await sql`
    UPDATE "Clinic"
    SET "ghlContactId" = ${ghlContactId}
    WHERE "id" = ${clinicId}
    RETURNING *
  `;
  return updated[0] || null;
}

async function getClinicByGHLSubscriptionId(ghlSubscriptionId) {
  const result = await sql`
    SELECT c.* FROM "Clinic" c
    JOIN "SubscriptionTier" st ON c."id" = st."clinicId"
    WHERE st."subscriptionId" = ${ghlSubscriptionId}
    LIMIT 1
  `;
  return result[0] || null;
}


export const clinicRepo = {
  createClinic,
  getClinicById,
  deleteClinic,
  getnumcoachesbyId,
  getNumWactiveCount,
  getRecentactivity,
  getCheckInsbyId,
  fetchRevenueData,
  fetchsubscriptionData,
  fetchTotalRevenue,
  getCheckIns,
  getAllRecentactivity,
  fetchAllRevenueData,
  fetchAllsubscriptionData,
  getAllClinics,
  fetchAllTotalRevenue,
  getNumWeeklyActivities,
  updateClinic,
  getClinicByEmail,
  updateClinicSubscription,
  getClinicByGHLContactId,
  updateClinicGHLContactId,
  getClinicByGHLSubscriptionId
};
