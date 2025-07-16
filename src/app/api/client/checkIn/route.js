import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { programRepo } from "@/app/lib/db/programRepo";
import { AIReviewRepo } from "@/app/lib/db/aiReviewRepo"
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { SubscriptionPlan } from "@/app/lib/stack";
import OpenAI from 'openai';

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
  const clinicId = sessionUser.clinic;
  const clinic_admin = await clinicRepo.getClinicById(clinicId);
  const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinicId);
  let plan = null;
  if (subscriptionTier && subscriptionTier.isActive && subscriptionTier.endDate > new Date()) {
    plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
  }
  const {
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
    notes,
    current,
  } = await request.json();

  try {
    const checkin = await clientRepo.createCheckIn(
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
    );
    if (plan.id === "pro") {
      const program = await programRepo.getProgrambyClientEmail(email);
      const jsonProgram = JSON.stringify(program);
      const jsonCheckIn = JSON.stringify({
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
      });
      const progressData = await clientRepo.getProgressbyClient(email, current);

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const prompt = `
You are a world-class digital health coach AI. Your task is to analyze a client’s daily and weekly check-in data alongside their selected health program details, then generate a detailed, personalized review. The review must align with the program’s goals and tone preferences, providing actionable advice, motivational feedback, and clear recommendations.

1. Input Data:
- Client’s Submitted Today Check-In Data (JSON): ${jsonCheckIn}
- Client’s Submitted Weekly Check-In Data (JSON): ${JSON.stringify(progressData)}
- Program Details (JSON): ${jsonProgram}

2. Instructions:
- Analyze all client health metrics (weight, sleep(hours), mood, exercise(minutes), hydration, etc.) comparing them against the program’s goals and guidelines.
- Evaluate meal portions (protein, carbs, fats, vegetables)(unit gram) for alignment with program nutrition guidelines(unit ounce).
- Identify strengths and areas needing improvement.
- Generate personalized feedback with:
- Positive yet realistic daily and weekly evaluation sentences.
- Meal evaluation comments using emojis and symbols for clarity.
- Exercise and activity feedback with encouragement.
- Actionable, varied recommendations for sleep, hydration, exercise, and nutrition improvements.
- Specific meal swap suggestions aligned with program portion guidelines.
- Positive reinforcement if client is doing well.
- Calculate a compliance score (0 to 10) based on weekly check-in data adherence to the program.
IMPORTANT: Respond with ONLY a valid JSON object in this exact format(not including any other string line like "json" at first):
{
  "weeklyTrend": string,
  "todaySummary": string,
  "today_Review_and_Recommendation": string, // Reference meals as "Meal 1", "Meal 2", etc., and include detailed numbers (grams, ounces, servings, etc.) in your feedback.
  "complianceScore": number,
  "mealReview": [string],  // Each item in this array is a single sentence reviewing one meal (labeled as "Meal 1", "Meal 2", etc.), considering its protein, carbohydrates, fats, and vegetables. The number of meal reviews must match the number of meals in the client's check-in data.
  "mealRecommendation": [
    {
      "proteinPortion": number,
      "carbsPortion": number,
      "fatsPortion": number,
      "foodnames": string,
      "description":string,
      "ingredients":string
    }
  ],
  "message": string
}
- For meal recommendation output, follow these rules:
  The number of items in the mealRecommendation array must exactly match the number of portion guidelines in the program, regardless of user check-in length.
  For each item in portion_guidelines:
  Convert protein, carbs, and fats from oz (as in portion_guidelines in Program) to grams (proteinPortion, carbsPortion, fatsPortion fields), rounding to the nearest whole gram.
  Ingredients Field:
  Calculate and state the actual weight (in ounces, rounded to one decimal place) of each real food required to provide AT LEAST the prescribed proteinPortion, carbsPortion, and fatsPortion.
  For each food, specify:
  "{X} oz {food} (provides {Y}g {macronutrient})"
  Use accurate macro values (examples:
  cooked chicken breast ≈ 9.1g protein/oz (32g/100g)
  cooked turkey breast ≈ 8.5g protein/oz (30g/100g)
  cooked brown rice ≈ 7.9g carbs/oz (28g/100g)
  cooked quinoa ≈ 6.0g carbs/oz (21g/100g)
  cooked sweet potato ≈ 6.1g carbs/oz (21.5g/100g)
  olive oil: 28g fat/oz
  avocado: 4.6g fat/oz (16g/100g)
  )—update as needed for regional/brand/real-food context.
  If more than one food is used for a macro, list each food and its weight.
  Do NOT list only macro values or total grams—show precise food weights.
  The combined weight(s) of each food group must yield AT LEAST the target macro for proteinPortion, carbsPortion, fatsPortion (never excess acceptable; a slight under-provide).
  Strictly follow food guidelines, cooking method rules, nutritional targets, food allergies, and food_avoid instructions from the program and user.
  Ensure all meal ingredients and macro calculations are realistic, verifiable, and appropriate for the program's guidelines and the user's data.
  If using mixed vegetables or condiments, list them as "plus {vegetables/condiments}," but prioritize macro-supplying foods in weight (oz) for the main macros.
  Never pattern-match, estimate, or use generic/rounded serving sizes without calculation. Always calculate exact weights from true macro values.
  Example ingredients field (for a single meal):
  "12.5 oz cooked chicken breast (provides 113g protein), 7.1 oz cooked brown rice (provides 56g carbs), 0.53 oz olive oil (provides 15g fat), plus mixed vegetables."

- Output must be in valid JSON only, no additional non-JSON explanation.
3. Additional Notes:
- During meal analyses, AI should not only check nutrients, but also compare them against the allergies and preferences. If it finds a potential issue, then include an appropriate warning with the In mealReview and mealRecomendation.
- Include numerical results wherever possible (e.g., grams, ounces, hours).
- Highlight achievements (e.g., hitting protein goals, consistent exercise) and weak points.
- Use emojis and icons to make feedback engaging and clear.
- Mention any major differences between check-in data and program targets explicitly(for example, the number of meals in today_Review_and_Recommendation).
- Ensure recommendations vary each time for freshness.
- the calories in checkIn data should be smaller than the each calories in program's portionGuidelines
- End with a motivational message encouraging the client to keep progressing.
All checkIn review and recommendation must be based on program totally.
    `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });
      const aiReview = completion.choices[0].message.content || '';
      const saveReview = await AIReviewRepo.createOrUpdateAIReview(email, aiReview);
    }
    return NextResponse.json({ status: true, checkin });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ status: false, message: error });
  }
}
