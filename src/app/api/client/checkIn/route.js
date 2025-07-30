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
      const clientId = await clientRepo.getClientIdbyEmail(email);
      const clientProfile = await clientRepo.getClientProfilebyId(clientId);
      const jsonClientProfile = JSON.stringify(clientProfile);
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
      const progressMonthlyData = await clientRepo.getProgressdataByRange(email,"month");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const prompt = `
You are a world-class digital health coach AI. Your task is to analyze a client’s daily and weekly check-in data alongside their selected health program details, then generate a detailed, personalized review. The review must align with the program’s goals and tone preferences, providing actionable advice, motivational feedback, and clear recommendations.

1. Input Data:
- Client’s Submitted Today Check-In Data (JSON): ${jsonCheckIn}
- Client’s Submitted Weekly Check-In Data (JSON): ${JSON.stringify(progressData)}
- Client’s Submitted Monthly Check-In Data (JSON): ${JSON.stringify(progressMonthlyData)}
- Program Details (JSON): ${jsonProgram}
- Client Profile (JSON): ${jsonClientProfile}
2. Instructions:
- Analyze all client health metrics (weight, sleep(hours), mood, exercise(minutes), hydration, etc.) comparing them against the program’s goals and guidelines.
- Evaluate meal portions (protein, carbs, fats, vegetables) for alignment with program nutrition guidelines.
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
  "monthlyTrend": string,
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
- In client Profile there are some data, foodAllergies, dietaryPreference, healthCondition, customRequests.
  The client's Today meal check-in data should be compared with the client's profile data.
  If the AI identified any issues , then include an appropriate warning with the In today_Review_and_Recommendation, mealReview and mealRecomendation.
  For example, if the client has a food allergy to eggs and check-in data has eggs, then the AI should warn strongly the client about the allergy in today_Review_and_Recommendation, mealReview and not recommend eggs in the mealRecommendation.
  If the client has a dietary preference for vegetarian and check-in data has meat, then the AI should warn strongly the client about the preference in today_Review_and_Recommendation, mealReview and not recommend meat in the mealRecommendation.
  If the client Profile has a healthCondition like diabetes and check-in data has high-sugar foods, then the AI should warn strongly the client in today_Review_and_Recommendation, mealReview and not recommend high-sugar foods in the mealRecommendation.
  If the client Profile has a customRequest like "Fibromyalgia" and check-in data has sausage, then the AI should warn strongly the client in today_Review_and_Recommendation, mealReview and not recommend dairy products in the mealRecommendation.
- For meal recommendation output, follow these rules:
Reference the client Profile data and Program data.
The number of items in the mealRecommendation array must exactly match the number of portion guidelines in the program, regardless of user check-in length.
For each item in mealRecommendation:
The values for "proteinPortion", "carbsPortion", and "fatsPortion" must be the "protein", "carbs", and "fats" values from the corresponding portion_guidelines item in the program. (Round to the nearest whole gram.)
Ingredients Field:
Calculate and state the actual weight (in ounces, rounded to one decimal place) of each real food required to provide at least the prescribed proteinPortion, carbsPortion, and fatsPortion.
For each macro source, specify:
"{X} oz {food} (provides {Y}g {macronutrient})"
If more than one food is used for a macro, list each food and its specific contribution.
If including vegetables or condiments for flavor (not as primary macro sources), phrase as: "plus {X} oz {vegetables/condiments}"
Use accurate, verified macro values for all calculations (examples:
cooked chicken breast ≈ 9.1g protein/oz (32g/100g)
cooked turkey breast ≈ 8.5g protein/oz (30g/100g)
cooked brown rice ≈ 7.9g carbs/oz (28g/100g)
cooked quinoa ≈ 6.0g carbs/oz (21g/100g)
cooked sweet potato ≈ 6.1g carbs/oz (21.5g/100g)
olive oil: 28g fat/oz
avocado: 4.6g fat/oz (16g/100g)
— update as needed for regional/brand/real-food context).
Do NOT list only macro values or totals—always specify food types and their calculated weights as shown.
Ensure the sum of macros from all listed ingredients meets but does not exceed the prescribed proteinPortion, carbsPortion, and fatsPortion.
Example:
in case proteinPortion 35g, carbsPortion 50g, fatsPortion 30g,
the ingredients should be
"3.9 oz grilled chicken breast (provides 35g protein), 6.3 oz cooked brown rice (provides 50g carbs), 1.1 oz olive oil (provides 30g fat), plus 5.0 oz mixed bell peppers"
Additional rules:
Strictly follow food guidelines, cooking method rules, nutritional targets, food allergies, and food_avoid instructions from the program and user.
Ensure all meal ingredients and macro calculations are realistic, verifiable, and appropriate for the program's guidelines and the user's data.
Prioritize macro-supplying foods in weight (oz) for the main macros.
Never pattern-match, estimate, or use generic/rounded serving sizes without calculation. Always calculate exact weights from true macro values.

- Output must be in valid JSON only, no additional non-JSON explanation.
3. Additional Notes:
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
