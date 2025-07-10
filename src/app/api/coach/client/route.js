import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { sendClientRegistrationEmail } from "@/app/lib/api/email";
import { SubscriptionPlan } from "@/app/lib/stack";

export async function GET() {
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
    if (user.role !== "coach" && user.role !== "clinic_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let coachId = user.id;
    let clientLimit = 0;
    const subscriptionTier = await subscriptionRepo.getSubscriptionTier(user.clinic);
    if (subscriptionTier && subscriptionTier.isActive && subscriptionTier.endDate >= new Date()) {
      const plan = SubscriptionPlan.find(plan => plan.id === subscriptionTier.planId);
      clientLimit = plan?.clientLimit;
    }
    const clients = await clientRepo.getclientsbycoachId(coachId);
    return NextResponse.json({ status: true, clients, clientLimit });
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
    if (user.role !== "coach") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const clinic = user.clinic;

    const { name, email, phone, programId, programCategory, startDate, notes, coachId, weightDate, initialWeight, goals, goalWeight } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ status: false, message: "Invalid request" });
    }
    const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const client = await clientRepo.createClient(name, email, phone, programId, programCategory, startDate, notes, coachId, clinic, weightDate, initialWeight, goals, goalWeight);
    await userRepo.createClientUser(
      name,
      email,
      phone,
      "client",
      randomPassword,
      clinic,
      coachId
    );
    await sendClientRegistrationEmail({ name, email, phone }, user.clinic.name, randomPassword);
    return NextResponse.json({ status: true, client });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
