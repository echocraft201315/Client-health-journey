import { NextResponse } from "next/server";
import { createCheckoutSession, updateSubscription } from "@/app/lib/api/stripe";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { SubscriptionPlan } from "@/app/lib/stack";
import authOptions from "@/app/lib/authoption";

export async function POST(request) {
    const { newPlan, currentPlan } = await request.json();
    if(!newPlan) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    if(newPlan === currentPlan) {
        return NextResponse.json({ success: false, error: "New plan cannot be the same as the current plan" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    const clinic = await clinicRepo.getClinicById(user.clinic);
    if(!clinic) {
        return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 400 });
    }

    const customerId = clinic.customerId;
    const priceId = SubscriptionPlan.find(plan => plan.id === newPlan).priceId;
    const clinicEmail = clinic.email;

    if(!currentPlan) {
        const session = await createCheckoutSession(customerId, priceId, clinicEmail);
        await subscriptionRepo.createSubscriptionTier(clinic.id, newPlan, customerId);
        return NextResponse.json({ success: true, url: session.url });
    } else {
        await subscriptionRepo.updateSubscriptionTier(clinic.id, newPlan);
        return NextResponse.json({ success: true });
    }
}