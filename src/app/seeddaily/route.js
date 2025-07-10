import { sql } from "../lib/db/postgresql";

async function seedSelfieImage() {
  await sql`
    CREATE TABLE IF NOT EXISTS "SelfieImage" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" VARCHAR(255) NOT NULL,
      "image" TEXT,
      "description" TEXT,
      "date" DATE
    );
  `;  
}

export async function GET() {
  try {
    await sql.begin(async (sql) => {
      await seedSelfieImage();
    });

    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
