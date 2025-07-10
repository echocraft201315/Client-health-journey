import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";
import { sql } from "@/app/lib/db/postgresql";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to deduplicate string lists
const deduplicateList = (listString) => {
    if (!listString) return "";
    // Split by comma and filter out empty strings and "none"
    const items = listString.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.toLowerCase() !== 'none');
    return [...new Set(items)].join(', ');
};

// Helper function to combine nutrition data
const combineNutritionData = (dataArray) => {
    const combined = {
        proteinList: "",
        protein: 0,
        carbsList: "",
        carbs: 0,
        fatList: "",
        fat: 0,
        vegetablesList: "",
        vegetables: 0,
        fruitList: "",
        fruit: 0,
        otherList: "",
        other: 0
    };

    dataArray.forEach(data => {
        // Sum up numerical values
        combined.protein += (data.protein) || 0;
        combined.carbs += (data.carbs) || 0;
        combined.fat += (data.fat) || 0;
        combined.vegetables += (data.vegetables) || 0;
        combined.fruit += (data.fruit) || 0;
        combined.other += (data.other) || 0;

        // Combine and deduplicate string lists
        if (data.proteinList) combined.proteinList = deduplicateList([combined.proteinList, data.proteinList].join(', '));
        if (data.carbsList) combined.carbsList = deduplicateList([combined.carbsList, data.carbsList].join(', '));
        if (data.fatList) combined.fatList = deduplicateList([combined.fatList, data.fatList].join(', '));
        if (data.vegetablesList) combined.vegetablesList = deduplicateList([combined.vegetablesList, data.vegetablesList].join(', '));
        if (data.fruitList) combined.fruitList = deduplicateList([combined.fruitList, data.fruitList].join(', '));
        if (data.otherList) combined.otherList = deduplicateList([combined.otherList, data.otherList].join(', '));
    });

    // Round all numerical values to 2 decimal places
    // combined.protein = Math.round(combined.protein * 100) / 100;
    // combined.carbs = Math.round(combined.carbs * 100) / 100;
    // combined.fat = Math.round(combined.fat * 100) / 100;
    // combined.vegetables = Math.round(combined.vegetables * 100) / 100;
    // combined.fruit = Math.round(combined.fruit * 100) / 100;
    // combined.other = Math.round(combined.other * 100) / 100;

    return combined;
};

// Helper function to combine micronutrient data
const combineMicroNutritionData = (dataArray) => {
    const micronutrientFields = [
        'fiber', 'sugar', 'sodium', 'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
        'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB12', 'folate',
        'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc', 'selenium'
    ];
    const combined = {};
    micronutrientFields.forEach(field => {
        combined[field] = 0;
    });
    let micronutrient_sources = [];
    dataArray.forEach(data => {
        micronutrientFields.forEach(field => {
            combined[field] += (data[field] || 0);
        });
        if (Array.isArray(data.micronutrient_sources)) {
            micronutrient_sources = micronutrient_sources.concat(data.micronutrient_sources);
        }
    });
    // Optionally deduplicate micronutrient_sources by name+source+amount
    const seen = new Set();
    combined.micronutrient_sources = micronutrient_sources.filter(item => {
        const key = `${item.name}|${item.amount}|${item.source}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    return combined;
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb',
        },
    },
};

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const sessionEmail = session.user.email;
        const sessionUser = await userRepo.getUserByEmail(sessionEmail);
        if (!sessionUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const email = sessionUser.email;
        const formData = await request.formData();
        console.log("formData", formData)
        const images = formData.getAll('images');
        const current = formData.get('current');
        const index = formData.get('index');
        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            );
        }

        // Process each image separately
        const analysisPromises = images.map(async (image) => {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Image = buffer.toString('base64');

            const messages = [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `
                                Analyze this food image and provide detailed nutritional information. 
                                IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
                                {
                                "food_name": "specific food name",
                                "description": "string - detailed description of the food",
                                "calories": number,
                                "protein": number,
                                "proteinList": "string- combined list of all protein foods",
                                "carbs": number,
                                "carbsList": "string- combined list of all carbohydrates foods",
                                "fat": number,
                                "fatList": "string- combined list of all fats foods",
                                "vegetables": number,
                                "vegetablesList": "string- combined list of all vegetables foods",
                                "fruit": number,
                                "fruitList": "string- combined list of all fruits foods",
                                "other": number,
                                "otherList": "string- combined list of all other foods",
                                "fiber": number,
                                "sugar": number,
                                "sodium": number,
                                "vitaminA": number,
                                "vitaminC": number,
                                "vitaminD": number,
                                "vitaminE": number,
                                "vitaminK": number,
                                "vitaminB1": number,
                                "vitaminB2": number,
                                "vitaminB3": number,
                                "vitaminB6": number,
                                "vitaminB12": number,
                                "folate": number,
                                "calcium": number,
                                "iron": number,
                                "magnesium": number,
                                "phosphorus": number,
                                "potassium": number,
                                "zinc": number,
                                "selenium": number,
                                }
                                Provide realistic nutritional values based on standard serving sizes. Include all micronutrients even if trace amounts (use 0 if none).
                              `
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ];

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                max_tokens: 2000,
                temperature: 0.1,
                response_format: { type: "json_object" }
            });

            const responseText = completion.choices[0].message.content;
            console.log("result", responseText)

            return JSON.parse(responseText);
        });

        // Wait for all image analyses to complete
        const analysisResults = await Promise.all(analysisPromises);
        // Combine all results
        const combinedNutritionData = combineNutritionData(analysisResults);
        const combinedMicroNutritionData = combineMicroNutritionData(analysisResults);
        await sql.begin(async (sql) => {
            await sql`
                INSERT INTO "MicroNutrients" ("email", "content", "createdAt", "index")
                VALUES (${email}, ${JSON.stringify(combinedMicroNutritionData)}, ${current}, ${index})
                ON CONFLICT ("email", "index", "createdAt") DO UPDATE SET
                  "content" = EXCLUDED."content"
            `;
        });
        console.log("combinedMicroNutritionData", combinedMicroNutritionData)
        return NextResponse.json(combinedNutritionData);
    } catch (error) {
        console.log('Error analyzing food images:', error);
        return NextResponse.json(
            { error: 'Failed to analyze food images' },
            { status: 500 }
        );
    }
} 