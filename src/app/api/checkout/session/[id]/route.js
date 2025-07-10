import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/api/stripe";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const session = await stripe.checkout.sessions.retrieve(id);
        try {
            const clinicEmail = session.customer_details?.email;
            const clinic = await clinicRepo.getClinicByEmail(clinicEmail);
            await subscriptionRepo.subscriptionActive(clinic.id, { isActive: true, subscriptionId: session.subscription });
            // await subscriptionRepo.createSubscriptionHistory(clinic.id, session.subscription);
        } catch (error) {
            console.error(error);
        }
        return NextResponse.json(session);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}