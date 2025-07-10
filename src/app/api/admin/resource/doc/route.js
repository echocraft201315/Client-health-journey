export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { resourceRepo } from "@/app/lib/db/resourceRepo";
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
        let texts;
        if (user.role === "admin") {
            texts = await resourceRepo.getAllDocs();
        }
        if (user.role === "clinic_admin") {
            texts = await resourceRepo.getAllDocsForClinic();
        }
        if (user.role === "coach") {
            texts = await resourceRepo.getAllDocsForCoach();
        }
        if (user.role === "client") {
            texts = await resourceRepo.getAllDocsForClient();
        }
        return NextResponse.json({ status: true, texts });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
