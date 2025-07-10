import { sql } from './postgresql';


async function getProgrambyClientEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  const clients = await sql`
    SELECT "programId"
    FROM "Client"
    WHERE "email" = ${email}
  `;

  if (!clients || clients.length === 0) {
    throw new Error('Client not found');
  }

  const programId = clients[0].programId;
  if (!programId) {
    throw new Error('Program ID not found for client');
  }

  const programs = await sql`
    SELECT *
    FROM "Program"
    WHERE "id" = ${programId}
  `;

  if (!programs || programs.length === 0) {
    throw new Error('Program not found');
  }

  return programs[0];
}

async function getPrograms(clinicId) {
  // Get all programs for the clinic with template info
  const programs = await sql`
  SELECT * 
  FROM "Program"
  WHERE "clinicId" = ${clinicId} OR "all" = 'all'
`;

  // Get client counts grouped by programId
  const clientCounts = await sql`
    SELECT "programId", COUNT(*) AS count
    FROM "Client"
    WHERE "clinic" = ${clinicId}
    GROUP BY "programId"
  `;

  // Convert clientCounts to a map for quick lookup
  const countMap = new Map(clientCounts.map(row => [row.programId, Number(row.count)]));

  // Add clientCount to each program
  const result = programs.map(program => ({
    ...program,
    clientCount: countMap.get(program.id) || 0,
  }));

  return result;
}

async function getProsForCreateClient(clinicId) {
  const programs = await sql`
  SELECT
  id,
  program_name,
  program_type,
  description,
  program_length 
  FROM "Program"
  WHERE "clinicId" = ${clinicId} OR "all" = 'all'
`;

  // Get client counts grouped by programId
  const clientCounts = await sql`
    SELECT "programId", COUNT(*) AS count
    FROM "Client"
    WHERE "clinic" = ${clinicId}
    GROUP BY "programId"
  `;

  // Convert clientCounts to a map for quick lookup
  const countMap = new Map(clientCounts.map(row => [row.programId, Number(row.count)]));

  // Add clientCount to each program
  const result = programs.map(program => ({
    ...program,
    clientCount: countMap.get(program.id) || 0,
  }));

  return result;
}

async function getAllProgramsAdmin() {
  return await sql`SELECT * FROM "Program"`;
}



async function createProgram(templateData) {
  const [program] = await sql`
  INSERT INTO "Program" (
  program_name,
  program_length,
  program_type,
  check_in_frequency,
  description,
  goals,
  food_rules,
  cooking_methods,
  recommended_proteins,
  recommended_vegetables,
  allowed_fruits,
  healthy_fats,
  food_allergies,
  dietary_preferences,
  foods_to_avoid,
  portion_guidelines,
  supplements,
  weekly_schedule,
  lifestyle,
  messaging_preferences,
  "clinicId"
) VALUES (
  ${templateData.program_name},
  ${templateData.program_length},
  ${templateData.program_type},
  ${templateData.check_in_frequency},
  ${templateData.description},
  ${JSON.stringify(templateData.goals)},
  ${JSON.stringify(templateData.food_rules)},
  ${JSON.stringify(templateData.cooking_methods)},
  ${templateData.recommended_proteins},
  ${templateData.recommended_vegetables},
  ${templateData.allowed_fruits},
  ${templateData.healthy_fats},
  ${templateData.food_allergies},
  ${JSON.stringify(templateData.dietary_preferences)},
  ${JSON.stringify(templateData.foods_to_avoid)},
  ${JSON.stringify(templateData.portion_guidelines)},
  ${JSON.stringify(templateData.supplements)},
  ${JSON.stringify(templateData.weekly_schedule)},
  ${JSON.stringify(templateData.lifestyle)},
  ${JSON.stringify(templateData.messaging_preferences)},
  ${templateData.clinicId}
)
RETURNING *
`;
  return program;
}

async function createProgramAdmin(templateData) {
  const [program] = await sql`
      INSERT INTO "Program" (
      program_name,
      program_length,
      program_type,
      check_in_frequency,
      description,
      goals,
      food_rules,
      cooking_methods,
      recommended_proteins,
      recommended_vegetables,
      allowed_fruits,
      healthy_fats,
      food_allergies,
      dietary_preferences,
      foods_to_avoid,
      portion_guidelines,
      supplements,
      weekly_schedule,
      lifestyle,
      messaging_preferences,
      "all"
    ) VALUES (
      ${templateData.program_name},
      ${templateData.program_length},
      ${templateData.program_type},
      ${templateData.check_in_frequency},
      ${templateData.description},
      ${JSON.stringify(templateData.goals)},
      ${JSON.stringify(templateData.food_rules)},
      ${JSON.stringify(templateData.cooking_methods)},
      ${templateData.recommended_proteins},
      ${templateData.recommended_vegetables},
      ${templateData.allowed_fruits},
      ${templateData.healthy_fats},
      ${templateData.food_allergies},
      ${JSON.stringify(templateData.dietary_preferences)},
      ${JSON.stringify(templateData.foods_to_avoid)},
      ${JSON.stringify(templateData.portion_guidelines)},
      ${JSON.stringify(templateData.supplements)},
      ${JSON.stringify(templateData.weekly_schedule)},
      ${JSON.stringify(templateData.lifestyle)},
      ${JSON.stringify(templateData.messaging_preferences)},
      'all'
    )
    RETURNING *
  `;
  return program;
}

async function createProgramCoach(templateData) {
  const [program] = await sql`
  INSERT INTO "Program" (
  program_name,
  program_length,
  program_type,
  check_in_frequency,
  description,
  goals,
  food_rules,
  cooking_methods,
  recommended_proteins,
  recommended_vegetables,
  allowed_fruits,
  healthy_fats,
  food_allergies,
  dietary_preferences,
  foods_to_avoid,
  portion_guidelines,
  supplements,
  weekly_schedule,
  lifestyle,
  messaging_preferences,
  "clinicId",
  "all"
) VALUES (
  ${templateData.program_name},
  ${templateData.program_length},
  ${templateData.program_type},
  ${templateData.check_in_frequency},
  ${templateData.description},
  ${JSON.stringify(templateData.goals)},
  ${JSON.stringify(templateData.food_rules)},
  ${JSON.stringify(templateData.cooking_methods)},
  ${templateData.recommended_proteins},
  ${templateData.recommended_vegetables},
  ${templateData.allowed_fruits},
  ${templateData.healthy_fats},
  ${templateData.food_allergies},
  ${JSON.stringify(templateData.dietary_preferences)},
  ${JSON.stringify(templateData.foods_to_avoid)},
  ${JSON.stringify(templateData.portion_guidelines)},
  ${JSON.stringify(templateData.supplements)},
  ${JSON.stringify(templateData.weekly_schedule)},
  ${JSON.stringify(templateData.lifestyle)},
  ${JSON.stringify(templateData.messaging_preferences)},
  ${templateData.clinicId},
  'coach'
)
RETURNING *
`;
  return program;
}

/**
 * Get all templates
 */
async function getTemplates() {
  return await sql`SELECT * FROM "Template"`;
}

/**
 * Get template by ID
 */
async function getTemplateDescription(id) {
  const template = await sql`SELECT * FROM "Template" WHERE "id" = ${id} LIMIT 1`;
  return template[0] || null;
}

/**
 * Create a new template
 */
async function createTemplate(templateData) {
  const [template] = await sql`
    INSERT INTO "Template" (
      program_name,
      program_length,
      program_type,
      check_in_frequency,
      description,
      goals,
      food_rules,
      cooking_methods,
      recommended_proteins,
      recommended_vegetables,
      allowed_fruits,
      healthy_fats,
      food_allergies,
      dietary_preferences,
      foods_to_avoid,
      portion_guidelines,
      supplements,
      weekly_schedule,
      lifestyle,
      messaging_preferences
    ) VALUES (
      ${templateData.program_name},
      ${templateData.program_length},
      ${templateData.program_type},
      ${templateData.check_in_frequency},
      ${templateData.description},
      ${JSON.stringify(templateData.goals)},
      ${JSON.stringify(templateData.food_rules)},
      ${JSON.stringify(templateData.cooking_methods)},
      ${templateData.recommended_proteins},
      ${templateData.recommended_vegetables},
      ${templateData.allowed_fruits},
      ${templateData.healthy_fats},
      ${templateData.food_allergies},
      ${JSON.stringify(templateData.dietary_preferences)},
      ${JSON.stringify(templateData.foods_to_avoid)},
      ${JSON.stringify(templateData.portion_guidelines)},
      ${JSON.stringify(templateData.supplements)},
      ${JSON.stringify(templateData.weekly_schedule)},
      ${JSON.stringify(templateData.lifestyle)},
      ${JSON.stringify(templateData.messaging_preferences)}
    )
    RETURNING *
  `;
  return template;
}

async function updateTemplate(id, data) {
  try {
    const result = await sql`
      UPDATE "Template"
      SET 
        program_name = ${data.program_name},
        program_length = ${data.program_length},
        program_type = ${data.program_type},
        check_in_frequency = ${data.check_in_frequency},
        description = ${data.description},
        goals = ${data.goals}::jsonb,
        food_rules = ${data.food_rules}::jsonb,
        cooking_methods = ${data.cooking_methods}::jsonb,
        recommended_proteins = ${data.recommended_proteins},
        recommended_vegetables = ${data.recommended_vegetables},
        allowed_fruits = ${data.allowed_fruits},
        healthy_fats = ${data.healthy_fats},
        food_allergies = ${data.food_allergies},
        dietary_preferences = ${data.dietary_preferences}::jsonb,
        foods_to_avoid = ${data.foods_to_avoid}::jsonb,
        portion_guidelines = ${data.portion_guidelines}::jsonb,
        supplements = ${data.supplements}::jsonb,
        weekly_schedule = ${data.weekly_schedule}::jsonb,
        lifestyle = ${data.lifestyle}::jsonb,
        messaging_preferences = ${data.messaging_preferences}::jsonb
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Template not found");
    }

    return result[0];
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
}

async function updateProgram(id, data) {
  try {
    const result = await sql`
      UPDATE "Program"
      SET 
        program_name = ${data.program_name},
        program_length = ${data.program_length},
        program_type = ${data.program_type},
        check_in_frequency = ${data.check_in_frequency},
        description = ${data.description},
        goals = ${data.goals}::jsonb,
        food_rules = ${data.food_rules}::jsonb,
        cooking_methods = ${data.cooking_methods}::jsonb,
        recommended_proteins = ${data.recommended_proteins},
        recommended_vegetables = ${data.recommended_vegetables},
        allowed_fruits = ${data.allowed_fruits},
        healthy_fats = ${data.healthy_fats},
        food_allergies = ${data.food_allergies},
        dietary_preferences = ${data.dietary_preferences}::jsonb,
        foods_to_avoid = ${data.foods_to_avoid}::jsonb,
        portion_guidelines = ${data.portion_guidelines}::jsonb,
        supplements = ${data.supplements}::jsonb,
        weekly_schedule = ${data.weekly_schedule}::jsonb,
        lifestyle = ${data.lifestyle}::jsonb,
        messaging_preferences = ${data.messaging_preferences}::jsonb
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error("Program not found");
    }

    return result[0];
  } catch (error) {
    console.error("Error updating program:", error);
    throw error;
  }
}

async function deleteTemplate(id) {
  const [deleted] = await sql`
    DELETE FROM "Template" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function deleteProgram(id) {
  const [deleted] = await sql`
    DELETE FROM "Program" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function getProgrambyId(id) {
  const [program] = await sql`
    SELECT * FROM "Program" WHERE "id" = ${id}
  `;
  return program || null;
}

export const programRepo = {
  getTemplates,
  getPrograms,
  createProgram,
  createTemplate,
  updateTemplate,
  updateProgram,
  deleteProgram,
  getTemplateDescription,
  deleteTemplate,
  getAllProgramsAdmin,
  createProgramAdmin,
  createProgramCoach,
  getProsForCreateClient,
  getProgrambyClientEmail,
  getProgrambyId
};
