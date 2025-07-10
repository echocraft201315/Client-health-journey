import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import {resourceRepo } from "@/app/lib/db/resourceRepo";
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
            texts = await resourceRepo.getAllTexts();
        }
        if (user.role === "clinic_admin") {
            texts = await resourceRepo.getAllTextsForClinic();
        }
        if (user.role === "coach") {
            texts = await resourceRepo.getAllTextsForCoach();
        }
        if (user.role === "client") {
            texts = await resourceRepo.getAllTextsForClient();
        }

        return NextResponse.json({ status: true, texts });
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

        const { title, description, role, category, type, content } = await request.json();
        const text = await resourceRepo.createformattedtext(
            title, description, role, category, type, content 
        );

        return NextResponse.json({ status: true, text });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}