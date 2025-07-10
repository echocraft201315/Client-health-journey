import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { programRepo } from "@/app/lib/db/programRepo";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const email = session.user.email;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin" && user.role !== "clinic_admin" && user.role != "coach") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const templates = await programRepo.getTemplates();
        return NextResponse.json({ staus: true, templates });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userEmail = session.user.email;
        const user = await userRepo.getUserByEmail(userEmail);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const {
            programName,
            programLength,
            programType,
            checkInFrequency,
            description,
            goals,
            foodRules,
            cookingMethods,
            recommendedProteins,
            recommendedVegetables,
            allowedFruits,
            healthyFats,
            foodAllergies,
            dietaryPreferences,
            foodsToAvoid,
            portionGuidelines,
            supplements,
            weeklySchedule,
            lifestyle,
            messagingPreferences
        } = await request.json();

        const template = await programRepo.createTemplate({
            program_name: programName,
            program_length: programLength,
            program_type: programType,
            check_in_frequency: checkInFrequency,
            description,
            goals,
            food_rules: foodRules,
            cooking_methods: cookingMethods,
            recommended_proteins: recommendedProteins,
            recommended_vegetables: recommendedVegetables,
            allowed_fruits: allowedFruits,
            healthy_fats: healthyFats,
            food_allergies: foodAllergies,
            dietary_preferences: dietaryPreferences,
            foods_to_avoid: foodsToAvoid,
            portion_guidelines: portionGuidelines,
            supplements,
            weekly_schedule: weeklySchedule,
            lifestyle,
            messaging_preferences: messagingPreferences
        });

        return NextResponse.json({ status: true, template });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}