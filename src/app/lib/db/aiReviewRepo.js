import { sql } from "./postgresql";

async function createOrUpdateAIReview(email, aiReview) {
  // Check if an AIReview already exists for this email
  const existing = await sql`
    SELECT * FROM "AIReview" WHERE "email" = ${email}
  `;

  let result;
  if (existing.length > 0) {
    // Update existing record
    [result] = await sql`
      UPDATE "AIReview"
      SET "content" = ${aiReview}
      WHERE "email" = ${email}
      RETURNING *
    `;
  } else {
    // Insert new record
    [result] = await sql`
      INSERT INTO "AIReview" ("email", "content")
      VALUES (${email}, ${aiReview})
      RETURNING *
    `;
  }

  return result;
}


async function getReviewbyClientEmail(email) {
  const Review = await sql`
  SELECT * FROM "AIReview"
  WHERE "email" = ${email}
`;

  return Review;
}

export const AIReviewRepo = {
    createOrUpdateAIReview,
    getReviewbyClientEmail
  };