import { sql } from "./postgresql";

async function getClients() {
  const clients = await sql`
    SELECT 
      c.*,
      cd.id AS coach_id,
      cd.name AS coach_name,
      cd.email AS coach_email,
      cd."phoneNumber" AS coach_phone,
      pd.id AS program_id,
      pd.program_name AS program_title,
      pd.description AS program_description,
      pd.program_length AS program_duration
    FROM "Client" c
    LEFT JOIN "User" cd ON c."coachId" = cd.id
    LEFT JOIN "Program" pd ON c."programId" = pd.id
  `;
  return clients;
}
async function getclientsbyclinicId(clinicId) {
  try {
    const clients = await sql`
      WITH last_checkins AS (
        SELECT 
          "email",
          MAX("selectedDate") as "lastCheckIn"
        FROM "CheckIn"
        GROUP BY "email"
      )
      SELECT 
        c.*,
        cd.id AS coach_id,
        cd.name AS coach_name,
        cd.email AS coach_email,
        cd."phoneNumber" AS coach_phone,
        pd.id AS program_id,
        pd.program_name AS program_title,
        pd.description AS program_description,
        pd.program_length AS program_duration,
        lc."lastCheckIn"
      FROM "Client" c
      LEFT JOIN "User" cd ON c."coachId" = cd.id
      LEFT JOIN "Program" pd ON c."programId" = pd.id
      LEFT JOIN last_checkins lc ON c.email = lc.email
      WHERE c."clinic" = ${clinicId}
    `;
    return clients;
  } catch (error) {
    console.error('Error in getclientsbyclinicId:', error);
    throw error;
  }
}

async function getnumclientsbyId(coachId) {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "Client" WHERE "coachId" = ${coachId}
  `;
  return result[0]?.count || 0;
}

async function getnumclientsbyClinicId(clinicId) {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "Client" WHERE "clinic" = ${clinicId}
  `;
  return result[0]?.count || 0;
}

async function getnumprojectsbyId(coachId) {
  const result = await sql`
    SELECT COUNT(DISTINCT "programId")::int AS "uniquePrograms"
    FROM "Client"
    WHERE "coachId" = ${coachId}
  `;
  return result[0]?.uniquePrograms || 0;
}

async function createClient(
  name,
  email,
  phone,
  programId,
  programCategory,
  startDate,
  notes,
  coachId,
  clinic,
  weightDate,
  initialWeight,
  goals,
  goalWeight
) {
  // Check if client exists
  const existingClient = await sql`
    SELECT * FROM "Client" WHERE "email" = ${email} LIMIT 1
  `;

  if (existingClient.length > 0) {
    return existingClient[0];
  }

  // Insert new client
  const [client] = await sql`
    INSERT INTO "Client" (
      "name", "email", "phone", "programId", "programCategory", "startDate", "notes",
      "coachId", "clinic", "weightDate", "initialWeight", "goals", "goalWeight"
    ) VALUES (
      ${name}, ${email}, ${phone}, ${programId}, ${programCategory}, ${startDate}, ${notes},
      ${coachId}, ${clinic}, ${weightDate}, ${initialWeight}, ${goals}, ${goalWeight}
    )
    RETURNING *
  `;

  return client;
}

async function getProgressdata(email) {
  const progress = await sql`
    SELECT 
      "selectedDate", "weight", "waist", "energyLevel", "moodLevel", "sleepHours"
    FROM "CheckIn"
    WHERE "email" = ${email}
    ORDER BY "selectedDate" DESC
    LIMIT 1
  `;
  return progress;
}


async function createCheckIn(
  name,
  email,
  coachId,
  clinic,
  selectedDate,
  weight,
  waist,
  waterIntake,
  energyLevel,
  moodLevel,
  exerciseType,
  exercise,
  exerciseTime,
  sleepHours,
  nutrition,
  supplements,
  notes
) {
  try {
    const checkIn = await sql`
      INSERT INTO "CheckIn" (
        "name", "email", "coachId", "clinic", "selectedDate", "weight", "waist", "waterIntake",
        "energyLevel", "moodLevel", "exerciseType", "exercise", "exerciseTime", "sleepHours",
        "nutrition", "supplements", "notes"
      ) VALUES (
        ${name}, ${email}, ${coachId}, ${clinic}, ${selectedDate}, ${weight}, ${waist}, ${waterIntake},
        ${energyLevel}, ${moodLevel}, ${exerciseType}, ${exercise}, ${exerciseTime}, ${sleepHours},
        ${JSON.stringify(nutrition || [])}, ${supplements}, ${notes}
      )
      RETURNING *
    `;
    return checkIn[0];
  } catch (error) {
    console.error("Error creating check-in:", error);
    throw error;
  }
}

async function getCheckInsbyRange(email, startDate, endDate) {
  const checkIns = await sql`
  SELECT * FROM "CheckIn"
  WHERE "email" = ${email}
    AND "selectedDate" >= ${startDate}
    AND "selectedDate" <= ${endDate}
  ORDER BY "selectedDate" ASC
`;

  return checkIns;
}

async function getWeightByClientId(clientId, email) {
  const initialWeight = await sql`
    SELECT "initialWeight", "goalWeight" FROM "Client" WHERE "id" = ${clientId}
  `;
  const currentWeight = await sql`
  SELECT "weight" FROM "CheckIn"
  WHERE "email" = ${email}
  ORDER BY "selectedDate" DESC
  LIMIT 1
  `;
  return {
    initialWeight: initialWeight[0]?.initialWeight || 0,
    goalWeight: initialWeight[0]?.goalWeight || 0,
    currentWeight: currentWeight[0]?.weight || 0
  }

}

async function getnumCheckInbyId(id) {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "CheckIn" WHERE "coachId" = ${id}
  `;
  return result[0]?.count || 0;
}

async function getActiveClients(id) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await sql`
    SELECT COUNT(DISTINCT "email")::int AS "activeClients"
    FROM "CheckIn"
    WHERE "coachId" = ${id} AND "selectedDate" >= ${thirtyDaysAgo}
  `;
  return result[0]?.activeClients || 0;
}

async function getCheckIns(id) {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "CheckIn" WHERE "coachId" = ${id}
  `;
  return result[0]?.count || 0;
}

async function gethistoricalData(coachId) {
  try {
    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Step 1: Get emails of clients for this coach
    const clients = await sql`
      SELECT "email" FROM "Client" WHERE "coachId" = ${coachId}
    `;
    const emails = clients.map(c => c.email);

    if (emails.length === 0) {
      return []; // No clients, return empty array early
    }

    // Step 2: Aggregate check-ins by month for those emails
    // We use TO_CHAR for month abbreviation and EXTRACT for month number
    const result = await sql`
      SELECT
        TO_CHAR("selectedDate", 'Mon') AS month,
        EXTRACT(MONTH FROM "selectedDate")::int AS monthNum,
        COUNT(*) AS "checkIns",
        ROUND(AVG(NULLIF("weight", 0)))::int AS "avgWeight"
      FROM "CheckIn"
      WHERE "email" = ANY(${emails})
        AND "selectedDate" >= ${sixMonthsAgo}
      GROUP BY month, monthNum
      ORDER BY monthNum
    `;

    return result;
  } catch (error) {
    console.error('[CoachDashboard] Error fetching historical data:', error);
    return [];
  }
}

async function getPendingCheckIns(coachId) {
  try {
    // Date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // This query finds all clients of the coach and their last check-in date,
    // then filters those with no check-in or last check-in older than 7 days.

    // Step 1: Get all clients for the coach (email and name)
    const clients = await sql`
      SELECT "email", "name" FROM "Client" WHERE "coachId" = ${coachId}
    `;

    if (clients.length === 0) {
      return [];
    }

    // Step 2: Get last check-in date per client email
    const emails = clients.map(c => c.email);

    const lastCheckIns = await sql`
      SELECT "email", MAX("selectedDate") AS "lastCheckIn"
      FROM "CheckIn"
      WHERE "email" = ANY(${emails})
      GROUP BY "email"
    `;

    // Map last check-in dates by email for quick lookup
    const lastCheckInMap = new Map(
      lastCheckIns.map(row => [row.email, row.lastCheckIn])
    );

    // Step 3: Filter clients who have no check-in or last check-in older than 7 days
    const pendingCheckIns = clients
      .filter(client => {
        const lastCheckIn = lastCheckInMap.get(client.email);
        return !lastCheckIn || lastCheckIn < oneWeekAgo;
      })
      .map(client => ({
        email: client.email,
        name: client.name,
        lastCheckIn: lastCheckInMap.get(client.email) || null,
      }));

    return pendingCheckIns;
  } catch (error) {
    console.error('Error fetching pending check-ins:', error);
    throw error;
  }
}

async function getCompletedProgramsCount(coachId) {
  try {
    const currentDate = new Date();

    // Step 1: Get clients with non-null startDate and programId
    const clients = await sql`
      SELECT c."startDate", c."programId", p."program_length"
      FROM "Client" c
      JOIN "Program" p ON c."programId" = p."id"
      WHERE c."coachId" = ${coachId}
        AND c."startDate" IS NOT NULL
        AND c."programId" IS NOT NULL
    `;

    // Helper to parse duration string (e.g. "12 weeks", "30 days", "3 months")
    function parseDuration(durationStr) {
      if (!durationStr) return { value: 0, unit: 'unknown' };
      const match = durationStr.match(/^(\d+)\s*(weeks|days|months)$/i);
      if (!match) return { value: 0, unit: 'unknown' };
      return { value: parseInt(match[1], 10), unit: match[2].toLowerCase() };
    }

    // Convert duration to days
    function durationToDays(value, unit) {
      switch (unit) {
        case 'weeks': return value * 7;
        case 'days': return value;
        case 'months': return value * 30;
        default: return 0;
      }
    }

    // Step 2: Calculate endDate and count completed programs
    let completedCount = 0;
    for (const row of clients) {
      const { startDate, program_length } = row;
      const { value, unit } = parseDuration(program_length);
      const durationInDays = durationToDays(value, unit);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationInDays);

      if (endDate < currentDate) {
        completedCount++;
      }
    }

    return completedCount;
  } catch (error) {
    console.error('[CompletedPrograms] Error counting completed programs:', error);
    return 0;
  }
}

async function getCoachRecentActivities(coachId, limit = 5) {
  try {
    // Step 1: Get unique clients (email, name) for this coach from CheckIn table
    const clientsData = await sql`
      SELECT DISTINCT ON ("email") "email", "name"
      FROM "CheckIn"
      WHERE "coachId" = ${coachId}
      ORDER BY "email", "selectedDate" DESC
    `;

    if (!clientsData || clientsData.length === 0) {
      return [];
    }

    const clientEmails = clientsData.map(c => c.email);
    const clientNameMap = Object.fromEntries(clientsData.map(c => [c.email, c.name]));

    // Step 2: Get recent check-ins for these clients
    const checkInsData = await sql`
      SELECT "id", "selectedDate", "email"
      FROM "CheckIn"
      WHERE "email" = ANY(${clientEmails})
        AND "coachId" = ${coachId}
      ORDER BY "selectedDate" DESC
      LIMIT ${limit}
    `;

    // Step 3: Format activities
    const activities = checkInsData.map(checkIn => ({
      id: checkIn.id.toString(),
      type: 'check_in',
      description: `${clientNameMap[checkIn.email] || 'A client'} submitted a check-in`,
      timestamp: new Date(checkIn.selectedDate).toISOString(),
      email: checkIn.email,
    }));

    return activities;
  } catch (error) {
    console.error('[CoachDashboard] Error fetching recent activities:', error);
    throw error;
  }
}

async function getClinics() {
  // We will do LEFT JOINs and aggregate counts accordingly.
  const clinics = await sql`
    SELECT
      c.*,
      COALESCE(coach_counts.count, 0) AS "coachesCount",
      COALESCE(client_counts.count, 0) AS "clientsCount",
      ca."id" AS "clinicAdminId",
      ca."name" AS "clinicAdminName",
      ca."email" AS "clinicAdminEmail"
    FROM "Clinic" c
    LEFT JOIN (
      SELECT "clinic", COUNT(*) AS count
      FROM "User"
      WHERE "role" = 'coach'
      GROUP BY "clinic"
    ) AS coach_counts ON coach_counts."clinic" = c."id"
    LEFT JOIN (
      SELECT "clinic", COUNT(*) AS count
      FROM "Client"
      GROUP BY "clinic"
    ) AS client_counts ON client_counts."clinic" = c."id"
    LEFT JOIN LATERAL (
      SELECT "id", "name", "email"
      FROM "User"
      WHERE "clinic" = c."id" AND "role" = 'clinic_admin'
      LIMIT 1
    ) AS ca ON true
  `;

  return clinics;
}

async function getclientNum() {
  const result = await sql`SELECT COUNT(*)::int AS count FROM "Client"`;
  return result[0]?.count || 0;
}

async function getClinentNum(clinicId) {
  const clients = await sql`
    SELECT * FROM "Client" WHERE "clinic" = ${clinicId}
  `;
  return clients;
}

async function updateClientNum(clinicId) {
  // Assuming you have a "clients" numeric column in Clinic table to track client count
  const updatedClinic = await sql`
    UPDATE "Clinic"
    SET "clients" = COALESCE("clients", 0) + 1
    WHERE "id" = ${clinicId}
    RETURNING *
  `;
  return updatedClinic[0];
}

async function getclientsbycoachId(coachId) {
  try {
    if (!coachId) {
      return [];
    }
    const clients = await sql`
      WITH last_checkins AS (
        SELECT 
          "email",
          MAX("selectedDate") as "lastCheckIn"
        FROM "CheckIn"
        GROUP BY "email"
      )
      SELECT 
        c.*,
        cd.id AS coach_id,
        cd.name AS coach_name,
        cd.email AS coach_email,
        cd."phoneNumber" AS coach_phone,
        pd.id AS program_id,
        pd.program_name AS program_title,
        pd.description AS program_description,
        pd.program_length AS program_duration,
        lc."lastCheckIn"
      FROM "Client" c
      LEFT JOIN "User" cd ON c."coachId" = cd.id
      LEFT JOIN "Program" pd ON c."programId" = pd.id
      LEFT JOIN last_checkins lc ON c.email = lc.email
      WHERE c."coachId" = ${coachId}
    `;
    return clients;
  } catch (error) {
    console.log('Error in getclientsbyclinicId:', error);
    throw error;
  }
}

async function getClientById(clientId) {
  const client = await sql`
    SELECT * FROM "Client" WHERE "id" = ${clientId} LIMIT 1
  `;
  return client[0] || null;
}

async function getProgressdataByRange(email, timeRange) {
  let fromDate;
  const now = new Date();

  switch (timeRange) {
    case 'month':
      fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'week':
      fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      fromDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      fromDate = null;
  }

  if (!fromDate) {
    return [];
  }

  const progress = await sql`
    SELECT * FROM "CheckIn"
    WHERE "email" = ${email} AND "selectedDate" >= ${fromDate}
  `;

  return progress;
}

async function getProgressbyClient(email, current) {
  return await sql`
    SELECT * FROM "CheckIn"
    WHERE "email" = ${email}
    AND "selectedDate" >= (DATE(${current})) - INTERVAL '6 days'
    ORDER BY "selectedDate" ASC
  `;
}


async function initialState(email) {
  return await sql`
    SELECT 
      "startDate",
      "initialWeight",
      "goalWeight"
    FROM "Client"
    WHERE "email" = ${email}
  `;
}

async function getEmailById(id) {
  const result = await sql`
    SELECT "email"
    FROM "Client"
    WHERE "id" = ${id}
  `;
  // Assuming 'sql' returns an array of rows
  return result[0]?.email || null;
}

async function getProgramIdbyClientEmail(email) {
  const result = await sql`
    SELECT "programId"
    FROM "Client"
    WHERE "email" = ${email}
  `;
  // Assuming 'sql' returns an array of rows
  return result[0]?.programId || null;
}

export const clientRepo = {
  getClients,
  getclientsbyclinicId,
  getnumclientsbyId,
  getnumclientsbyClinicId,
  getnumprojectsbyId,
  createClient,
  getProgressdata,
  createCheckIn,
  getCheckInsbyRange,
  getnumCheckInbyId,
  getActiveClients,
  getCheckIns,
  getclientsbycoachId,
  getClinics,
  getClinentNum,
  updateClientNum,
  getclientNum,
  getClientById,
  getProgressdataByRange,
  gethistoricalData,
  getPendingCheckIns,
  getCompletedProgramsCount,
  getCoachRecentActivities,
  getWeightByClientId,
  getProgressbyClient,
  initialState,
  getEmailById,
  getProgramIdbyClientEmail,
};
