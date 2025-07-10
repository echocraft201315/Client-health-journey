import { sql } from './postgresql';
const crypto = require('crypto');

const HASH_ITERATIONS = 10000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('base64');
}


export const userRepo = {
  resetPassword,
  updateCoach,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  deleteCoach,
  authenticate,
  getUserById,
  getUserByEmail,
  getCoachesByClinicId,
  getNumCoachesByClinicId,
  createClientUser,
  updateCoachNum,
  getCoaches,
  getNumClinics,
  getNumTotalCoaches,
  getClinicAdmin,
  deleteClinicMembers,
  deleteClient,
};

async function getAdminUsers() {
  return await sql`SELECT * FROM "User" WHERE "role" = 'admin'`;
}

async function deleteClient(email) {
  const [deleted] = await sql`DELETE FROM "User" WHERE "email" = ${email} RETURNING *`;
  const [deletedClient] = await sql`DELETE FROM "Client" WHERE "email" = ${email} RETURNING *`;
  const [deleteCheckIn] = await sql`DELETE FROM "CheckIn" WHERE "email" = ${email} RETURNING *`;
  const [deleteMessage] = await sql`DELETE FROM "Message" WHERE "sender" = ${email} OR "receiver" = ${email} RETURNING *`;
  const [deleteNotification] = await sql`DELETE FROM "Notification" WHERE "email" = ${email} RETURNING *`;
  const [deleteAIReview] = await sql`DELETE FROM "AIReview" WHERE "email" = ${email} RETURNING *`;
  return deleted || null;
}

async function createAdminUser(name, email, phoneNumber, role, password, clinic, options = {}) {
  const existing = await sql`SELECT * FROM "User" WHERE "email" = ${email} LIMIT 1`;
  if (existing.length > 0) return existing[0];

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const [user] = await sql`
    INSERT INTO "User" ("name", "email", "phoneNumber", "role", "password", "clinic", "salt")
    VALUES (${name}, ${email}, ${phoneNumber}, ${role}, ${hashedPassword}, ${clinic}, ${salt})
    RETURNING *
  `;
  return user;
}

async function createClientUser(name, email, phoneNumber, role, password, clinic, coachId, options = {}) {
  const existing = await sql`SELECT * FROM "User" WHERE "email" = ${email} LIMIT 1`;
  if (existing.length > 0) return existing[0];

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const [user] = await sql`
    INSERT INTO "User" ("name", "email", "phoneNumber", "role", "password", "clinic", "coachId", "salt")
    VALUES (${name}, ${email}, ${phoneNumber}, ${role}, ${hashedPassword}, ${clinic}, ${coachId}, ${salt})
    RETURNING *
  `;
  return user;
}

async function updateAdminUser(id, name, email, phone, role, isActive, origin) {
  const [updated] = await sql`
    UPDATE "User"
    SET "name" = ${name},
        "email" = ${email},
        "phoneNumber" = ${phone},
        "role" = ${role},
        "isActive" = ${isActive}
    WHERE "id" = ${id}
    RETURNING *
  `; if (role === "coach" || role === "client") {
    // Update CheckIn table
    const [dd] = await sql`
      UPDATE "CheckIn"
      SET "email" = ${email}
      WHERE "email" = ${origin}
      RETURNING *
    `;

    // Update Message table: update both sender and receiver if they match origin
    const [mes] = await sql`
      UPDATE "Message"
      SET
        "sender" = CASE WHEN "sender" = ${origin} THEN ${email} ELSE "sender" END,
        "receiver" = CASE WHEN "receiver" = ${origin} THEN ${email} ELSE "receiver" END
      WHERE "sender" = ${origin} OR "receiver" = ${origin}
      RETURNING *
    `;

    // Update Notification table
    const [No] = await sql`
      UPDATE "Notification"
      SET "email" = ${email}
      WHERE "email" = ${origin}
      RETURNING *
    `;
  }

  if (role === "client") {
    // Update Client table (removed trailing comma)
    const [cli] = await sql`
      UPDATE "Client"
      SET
        "email" = ${email},
        "phone" = ${phone}
      WHERE "email" = ${origin}
      RETURNING *
    `;
  }



  return updated || null;
}

async function deleteAdminUser(id) {
  const [deleted] = await sql`
    DELETE FROM "User" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function authenticate(email, inputPassword) {
  // Fetch user by email
  const result = await sql`SELECT * FROM "User" WHERE email = ${email}`;
  const user = result[0];

  if (!user) {
    throw new Error("Invalid email");
  }

  // Hash input password with stored salt
  const inputHash = hashPassword(inputPassword, user.salt);

  if (inputHash !== user.password) {
    return null; // Password mismatch
  }

  if (!user.isActive) {
    throw new Error("User is not active");
  }

  // Return user object without sensitive fields
  const { password, salt, ...safeUser } = user;
  return safeUser;
}

async function getUserById(id) {
  if (!id) {
    throw new Error('User ID is required');
  }

  try {
    const users = await sql`
      SELECT 
        u.*,
        row_to_json(c) AS clinicDetail
      FROM "User" u
      LEFT JOIN "Clinic" c ON u."clinic" = c."id"
      WHERE u."id" = ${id}
      LIMIT 1
    `;

    if (!users || users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw new Error('Failed to fetch user');
  }
}

async function getUserByEmail(email) {
  const users = await sql`
  SELECT 
    u.*,
    row_to_json(c) AS clinicDetail
  FROM "User" u
  LEFT JOIN "Clinic" c ON u."clinic" = c."id"
  WHERE u."email" = ${email}
  LIMIT 1
`;
  return users[0] || null;
}

async function getCoachesByClinicId(clinicId) {
  const coaches = await sql`
    SELECT 
      u.*,
      row_to_json(c) AS clinicDetail
    FROM "User" u
    LEFT JOIN "Clinic" c ON u."clinic" = c."id"
    WHERE u."role" = 'coach' AND u."clinic" = ${clinicId}
  `;
  return coaches;
}


async function getNumCoachesByClinicId(clinicId) {
  const result = await sql`
    SELECT COUNT(*)::int AS count
    FROM "User"
    WHERE "role" = 'coach' AND "clinic" = ${clinicId}
  `;
  return result[0]?.count || 0;
}

async function updateCoach(id, name, email, phone) {
  const [updated] = await sql`
    UPDATE "User"
    SET "name" = ${name},
        "email" = ${email},
        "phoneNumber" = ${phone}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated || null;
}

async function deleteCoach(id) {
  const [deleted] = await sql`
    DELETE FROM "User" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function resetPassword(id, newPassword) {
  const users = await sql`SELECT * FROM "User" WHERE "id" = ${id} LIMIT 1`;
  if (users.length === 0) return null;

  const salt = generateSalt();
  const hashedPassword = hashPassword(newPassword, salt);

  const [updated] = await sql`
    UPDATE "User"
    SET "password" = ${hashedPassword}, "salt" = ${salt}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated || null;
}

async function updateCoachNum(clinicId) {
  const [updated] = await sql`
    UPDATE "Clinic"
    SET "coaches" = COALESCE("coaches", 0) + 1
    WHERE "id" = ${clinicId}
    RETURNING *
  `;
  return updated || null;
}

async function getCoaches() {
  const coaches = await sql`
    SELECT 
      u.*,
      row_to_json(c) AS clinicDetail
    FROM "User" u
    LEFT JOIN "Clinic" c ON u."clinic" = c."id"
    WHERE u."role" = 'coach'
  `;
  return coaches;
}

async function getNumClinics() {
  const result = await sql`SELECT COUNT(*)::int AS count FROM "Clinic"`;
  return result[0]?.count || 0;
}

async function getNumTotalCoaches() {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "User" WHERE "role" = 'coach'
  `;
  return result[0]?.count || 0;
}

async function getClinicAdmin(clinicId) {
  const admins = await sql`
    SELECT * FROM "User"
    WHERE "role" = 'clinic_admin' AND "clinic" = ${clinicId}
    LIMIT 1
  `;
  return admins[0] || null;
}

async function deleteClinicMembers(clinicId) {
  await sql`
    DELETE FROM "User" WHERE "clinic" = ${clinicId}
  `;
}
