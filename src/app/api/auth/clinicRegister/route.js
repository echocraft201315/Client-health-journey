import { NextRequest, NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { sendCoachRegistrationEmail } from "@/app/lib/api/email";
import { SubscriptionPlan } from "@/app/lib/stack";

export async function POST(request) {
    const {
        clinicName,
        clinicEmail,
        clinicPhone,
        streetAddress,
        city,
        state,
        zipCode,
        primaryContact,
        email,
        password,
        confirmPassword,
        hipaaAcknowledgment,
        legalAcknowledgment,
        selectedPlan,
        addOns,
        additionalCoaches,
    } = await request.json();

    if (!clinicName || !clinicEmail || !clinicPhone || !streetAddress || !city || !state || !zipCode || !primaryContact || !email || !password || !confirmPassword || !hipaaAcknowledgment || !legalAcknowledgment || !selectedPlan) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (password !== confirmPassword) {
        return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }

    let clinic = null;
    let adminUser = null;
    const createdCoachUsers = [];

    try {
        // Step 1: Create clinic in local database
        clinic = await clinicRepo.createClinic(
            clinicEmail,
            clinicName,
            clinicPhone,
            primaryContact,
            streetAddress,
            city,
            state,
            zipCode,
            addOns,
            hipaaAcknowledgment,
            legalAcknowledgment
        );

        // Step 2: Create subscription tier
        const subscriptionTier = await subscriptionRepo.createSubscriptionTier(
            clinic.id,
            selectedPlan
        );

        console.log("Subscription tier created:", subscriptionTier.id);

        // Step 3: Create admin user
        adminUser = await userRepo.createAdminUser(
            primaryContact,
            email,
            clinicPhone,
            "clinic_admin",
            password,
            clinic.id
        );

        // Step 4: Create coach users if any
        if (additionalCoaches && additionalCoaches.length > 0) {
            for (const coach of additionalCoaches) {
                if (!coach.name || !coach.email || !coach.phone) {
                    continue;
                }
                try {
                    const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    await sendCoachRegistrationEmail(coach, randomPassword);
                    const coachUser = await userRepo.createAdminUser(
                        coach.name,
                        coach.email,
                        coach.phone,
                        "coach",
                        randomPassword,
                        clinic.id
                    );
                    createdCoachUsers.push(coachUser);
                } catch (error) {
                    console.error("Error creating coach user:", error);
                }
            }
        }

        // Step 5: Get the GHL payment link for the selected plan
        const plan = SubscriptionPlan.find(p => p.id === selectedPlan);
        const ghlPaymentLink = plan?.ghlPaymentLink;

        if (!ghlPaymentLink) {
            throw new Error(`No payment link found for plan: ${selectedPlan}`);
        }

        return NextResponse.json({
            success: true,
            url: "/login",
            ghlPaymentLink: ghlPaymentLink,
            message: "Registration successful! Please complete your payment to activate your subscription."
        });

    } catch (error) {
        console.log("Error in clinic registration:", error);

        // Rollback in reverse order
        try {
            // Delete all created coach users
            for (const coachUser of createdCoachUsers) {
                await userRepo.deleteAdminUser(coachUser.id);
            }

            // Delete admin user if created
            if (adminUser) {
                await userRepo.deleteAdminUser(adminUser.id);
            }

            // Delete clinic if created
            if (clinic) {
                await clinicRepo.deleteClinic(clinic.id);
            }
        } catch (rollbackError) {
            console.log("Error during rollback:", rollbackError);
        }

        return NextResponse.json({ success: false, url: "/login", message: error.message }, { status: 400 });
    }
}