import { sql } from '../lib/db/postgresql';

async function seedClientProfile() {
  await sql`
    CREATE TABLE "ClientProfile" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "clientId" UUID REFERENCES "Client"("id"),
        "profileData" JSONB,
        "healthConditions" JSONB,
        "customRequests" JSONB,
        "coachingPrefs" JSONB
    );
  `;
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedClientProfile();
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message || error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
