import { NextRequest, NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { sendCoachRegistrationEmail } from "@/app/lib/api/email";
import { createCustomer, createCheckoutSession } from "@/app/lib/api/stripe";
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
        // Create clinic
        const customer = await createCustomer(clinicEmail, clinicName);
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
            legalAcknowledgment,
            customer.id
        );
        
        const subscriptionTier = await subscriptionRepo.createSubscriptionTier(clinic.id, selectedPlan, customer.id);
        console.log("Created subscription tier:", subscriptionTier);
        
        if (!subscriptionTier || !subscriptionTier.id) {
            throw new Error("Failed to create subscription tier");
        }
                
        const priceId = SubscriptionPlan.find(plan => plan.id === selectedPlan).priceId;
        const session = await createCheckoutSession(customer.id, priceId, clinicEmail);

        // Create admin user
        adminUser = await userRepo.createAdminUser(
            primaryContact, 
            email, 
            clinicPhone, 
            "clinic_admin", 
            password, 
            clinic.id
        );

        // Create coach users if any
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

        return NextResponse.json({ success: true, message: "Clinic created successfully", url: session.url }, { status: 200 });
    } catch (error) {
        console.log(error);
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
        
        return NextResponse.json({ success: false, message: "Error creating clinic" }, { status: 500 });
    }
}