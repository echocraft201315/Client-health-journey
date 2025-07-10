import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "admin" && sessionUser.role != "clinic_admin" && sessionUser.role != "coach") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await request.json();

  try {
    const program = await programRepo.updateProgram(id, {
      program_name: data.programName,
      program_length: data.programLength,
      program_type: data.programType,
      check_in_frequency: data.checkInFrequency,
      description: data.description,
      goals: JSON.stringify(data.goals),
      food_rules: JSON.stringify(data.foodRules),
      cooking_methods: JSON.stringify(data.cookingMethods),
      recommended_proteins: data.recommendedProteins,
      recommended_vegetables: data.recommendedVegetables,
      allowed_fruits: data.allowedFruits,
      healthy_fats: data.healthyFats,
      food_allergies: data.foodAllergies,
      dietary_preferences: JSON.stringify(data.dietaryPreferences),
      foods_to_avoid: JSON.stringify(data.foodsToAvoid),
      portion_guidelines: JSON.stringify(data.portionGuidelines),
      supplements: JSON.stringify(data.supplements),
      weekly_schedule: JSON.stringify(data.weeklySchedule),
      lifestyle: JSON.stringify(data.lifestyle),
      messaging_preferences: JSON.stringify(data.messagingPreferences)
    });
    return NextResponse.json({ status: true, program });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "admin" && sessionUser.role != "clinic_admin" && sessionUser.role != "coach") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const program = await programRepo.deleteProgram(id);
    return NextResponse.json({ status: true, program });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: false, message: error.message });
  }
}