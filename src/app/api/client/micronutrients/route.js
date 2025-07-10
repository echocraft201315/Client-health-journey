import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";
import { sql } from "@/app/lib/db/postgresql";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const { selectedDate } = await request.json();
  try {
    const micronutrients = await sql`
      SELECT * FROM "MicroNutrients" WHERE "email" = ${sessionUser.email} AND "createdAt" = ${selectedDate}
    `;

    console.log("micronutrients", micronutrients)
    const totalMicronutrients = combineMicronutrientData(micronutrients);
    console.log("totalMicronutrients", totalMicronutrients)
    return NextResponse.json({ status: true, totalMicronutrients: totalMicronutrients });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ status: false, message: "wrong" });
  }
}

function combineMicronutrientData(micronutrients) {
  const combined = {
    fiber: 0, sugar: 0, sodium: 0, vitaminA: 0, vitaminC: 0, vitaminD: 0, vitaminE: 0, vitaminK: 0,
    vitaminB1: 0, vitaminB2: 0, vitaminB3: 0, vitaminB6: 0, vitaminB12: 0, folate: 0,
    calcium: 0, iron: 0, magnesium: 0, phosphorus: 0, potassium: 0, zinc: 0, selenium: 0,
    micronutrient_sources: []
  };

  const seenSources = new Set();

  micronutrients.forEach(entry => {
    let content;
    try {
      content = typeof entry.content === 'string' ? JSON.parse(entry.content) : entry.content;
    } catch {
      return;
    }
    Object.keys(combined).forEach(key => {
      if (key !== 'micronutrient_sources' && typeof content[key] === 'number') {
        combined[key] += content[key];
      }
    });
    if (Array.isArray(content.micronutrient_sources)) {
      content.micronutrient_sources.forEach(src => {
        const key = `${src.name}|${src.amount}|${src.source}`;
        if (!seenSources.has(key)) {
          seenSources.add(key);
          combined.micronutrient_sources.push(src);
        }
      });
    }
  });

  return combined;
}
