import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db/postgresql";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req) {
    // Auth: get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await userRepo.getUserByEmail(session.user.email);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userId = user.id;
    const today = new Date().toISOString().slice(0, 10);

    // Check cache
    const cached = await sql`
    SELECT "message" FROM "DailyMessage"
    WHERE "userId" = ${userId} AND "date" = ${today}
    LIMIT 1
  `;
    if (cached.length) {
        return NextResponse.json({ message: cached[0].message });
    }

    // If not cached, call OpenAI
    const prompt = "Write a short, motivational health tip for a client starting their day. including predefined emojis and symbols for clarity.";
    let aiMessage = "Have a great day!";
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });
        aiMessage = completion.choices[0].message.content;
    } catch (e) {
        aiMessage = "Stay positive and make healthy choices today!";
    }

    // UPSERT: Insert or update the message for this user and date
    await sql`
    INSERT INTO "DailyMessage" ("userId", "date", "message")
    VALUES (${userId}, ${today}, ${aiMessage})
    ON CONFLICT ("userId", "date") DO UPDATE SET "message" = EXCLUDED."message", "date" = EXCLUDED."date"
  `;

    return NextResponse.json({ message: aiMessage });
}