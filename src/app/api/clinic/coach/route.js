import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { sendCoachRegistrationEmail } from "@/app/lib/api/email";

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
        if (user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const clinicId = user.clinic;

        const coaches = await userRepo.getCoachesByClinicId(clinicId);
                return NextResponse.json({ staus: true, coaches });
            
    } catch (error) {
        console.error(error);
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
        if (user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const clinicId = user.clinic;

        const { name, email, phoneNumber } = await request.json();
        if (!name || !email) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const coach = await userRepo.createAdminUser(
            name,
            email,
            phoneNumber,
            "coach",
            randomPassword,
            clinicId
        );
        await sendCoachRegistrationEmail({ name, email }, randomPassword);
        return NextResponse.json({ status: true, coach });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
