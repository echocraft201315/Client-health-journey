import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";
import { sql } from "@/app/lib/db/postgresql";

export async function GET(req) {
    // Auth: get user session
    try{
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await userRepo.getUserByEmail(session.user.email);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const dailyMessage = await sql`
        SELECT "dailyMessage" FROM "Client" WHERE "email" = ${session.user.email}
        `;
        return NextResponse.json({ status: true, dailyMessage });
    }
    catch(error){
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await userRepo.getUserByEmail(session.user.email);
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    try{
    const dailyMessage = await sql`
        UPDATE "Client" SET "dailyMessage" = TRUE WHERE "email" = ${session.user.email}
        `;
    return NextResponse.json({ status: true, dailyMessage });
    }
    catch(error){
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}