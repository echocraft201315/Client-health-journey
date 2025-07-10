import { sql } from './postgresql';

async function createformattedtext(title, description, role, category, type, content) {
  const [text] = await sql`
    INSERT INTO "Resource" ("title", "description", "role","category", "type", "content")
    VALUES (${title}, ${description}, ${role}, ${category}, ${type}, ${content})
    RETURNING *
  `;
  return text;
}
async function saveVideo(title, role, type, content) {
  const [video] = await sql`
    INSERT INTO "Resource" ("title", "role", "type", "content")
    VALUES (${title}, ${role}, ${type}, ${content})
    RETURNING *
  `;
  return video;
}

async function getAllTexts() {
  const texts = await sql`
    SELECT * FROM "Resource"
    WHERE "type" = 'HTML';
  `;
  return texts;
}


async function updateResource(id, title, description, role, category, type, content) {
  const [resource] = await sql`
    UPDATE "Resource" SET "title" = ${title}, "description" = ${description}, "role" = ${role}, "category" = ${category}, "type" = ${type}, "content" = ${content} WHERE "id" = ${id}
  `;
  return resource;
}

async function deleteResource(id) {
  const [resource] = await sql`
    DELETE FROM "Resource" WHERE "id" = ${id}
  `;
  return resource;
}

async function getAllDocs() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "type" = 'Doc';
`;
  return texts;
}

async function getAllTextsForClinic() {
  const texts = await sql`
    SELECT * FROM "Resource"
    WHERE "role" IN ('clinic', 'all') AND "type" = 'HTML';
  `;
  return texts;
}

async function getAllTextsForCoach() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('coach', 'all') AND "type" = 'HTML';  `;
  return texts;
}

async function getAllTextsForClient() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('client', 'all') AND "type" IN ('HTML', 'Doc');  `;
  return texts;
}

async function getAllDocsForClinic() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('clinic', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

async function getAllDocsForCoach() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('coach', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

async function getAllDocsForClient() {
  const texts = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('client', 'all') AND "type" = 'Doc';
  `;
  return texts;
}

async function getAllVideos() {
  const videos = await sql`
  SELECT * FROM "Resource"
  WHERE "type" = 'Video';
  `;
  return videos;
}

async function getAllVideosForClinic() {
  const videos = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('clinic', 'all') AND "type" = 'Video';
  `;
  return videos;
}

async function getAllVideosForCoach() {
  const videos = await sql`
  SELECT * FROM "Resource"
  WHERE "role" IN ('coach', 'all') AND "type" = 'Video';
  `;
  return videos;
}

async function getResourceById(id) {
  const [resource] = await sql`
    SELECT * FROM "Resource"
    WHERE "id" = ${id}
  `;
  return resource;
}

async function savePDF(title, role, type, content) {
  const [pdf] = await sql`
    INSERT INTO "Resource" ("title", "role", "type", "content")
    VALUES (${title}, ${role}, ${type}, ${content})
    RETURNING *
  `;
  return pdf;
}

async function getAllPDFs() {
  const pdfs = await sql`
    SELECT * FROM "Resource"
    WHERE "type" = 'PDF';
  `;
  return pdfs;
}

async function getAllPDFsForClinic() {
  const pdfs = await sql`
    SELECT * FROM "Resource"
    WHERE "role" IN ('clinic', 'all') AND "type" = 'PDF';
  `;
  return pdfs;
}

async function getAllPDFsForCoach() {
  const pdfs = await sql`
    SELECT * FROM "Resource"
    WHERE "role" IN ('coach', 'all') AND "type" = 'PDF';
  `;
  return pdfs;
}

async function getAllPDFsForClient() {
  const pdfs = await sql`
    SELECT * FROM "Resource"
    WHERE "role" IN ('client', 'all') AND "type" = 'PDF';
  `;
  return pdfs;
}

export const resourceRepo = {
  createformattedtext,
  getAllTexts,
  updateResource,
  deleteResource,
  getAllDocs,
  getAllTextsForClinic,
  getAllTextsForCoach,
  getAllTextsForClient,
  getAllDocsForClinic,
  getAllDocsForCoach,
  getAllDocsForClient,
  getAllVideos,
  getAllVideosForClinic,
  getAllVideosForCoach,
  saveVideo,
  getResourceById,
  savePDF,
  getAllPDFs,
  getAllPDFsForClinic,
  getAllPDFsForCoach,
  getAllPDFsForClient,
}