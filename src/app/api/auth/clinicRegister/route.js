import { NextRequest, NextResponse } from "next/server";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { sendCoachRegistrationEmail } from "@/app/lib/api/email";
import { ghlApi, getGHLProductByPlanId, createGHLSubscriptionUrl } from "@/app/lib/api/ghl";
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
    let ghlContact = null;
    const createdCoachUsers = [];

    try {
        // Step 1: Create contact in GHL automatically
        console.log("Creating GHL contact for clinic:", clinicName);
        const contactName = primaryContact || clinicName;
        const [firstName, ...lastNameParts] = contactName.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        ghlContact = await ghlApi.createContact({
            email: clinicEmail,
            firstName: firstName,
            lastName: lastName,
            phone: clinicPhone,
            companyName: clinicName,
            customFields: {
                role: 'clinic_admin',
                planSelected: selectedPlan,
                registrationDate: new Date().toISOString(),
            }
        });

        console.log("GHL contact created:", ghlContact.id);

        // Step 2: Create clinic in local database
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
            null // No customerId needed for GHL
        );

        // Step 3: Update GHL contact with clinic ID
        await ghlApi.updateContact(ghlContact.id, {
            customFields: {
                clinicId: clinic.id,
                role: 'clinic_admin',
                planSelected: selectedPlan,
                registrationDate: new Date().toISOString(),
            }
        });

        // Step 4: Create GHL subscription tier (inactive until subscription is set up in GHL)
        const subscriptionTier = await subscriptionRepo.createGHLSubscriptionTier(
            clinic.id,
            selectedPlan,
            ghlContact.id
        );

        console.log("Subscription tier created:", subscriptionTier.id);

        // Step 5: Create admin user
        adminUser = await userRepo.createAdminUser(
            primaryContact,
            email,
            clinicPhone,
            "clinic_admin",
            password,
            clinic.id
        );

        // Step 6: Create coach users if any
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

        // Step 7: Prepare subscription setup information
        const plan = SubscriptionPlan.find(p => p.id === selectedPlan);
        const subscriptionSetupInfo = {
            ghlContactId: ghlContact.id,
            clinicId: clinic.id,
            selectedPlan: selectedPlan,
            planName: plan?.name || selectedPlan,
            planPrice: plan?.price || 0,
            ghlDashboardUrl: process.env.GHL_DASHBOARD_URL || 'https://app.gohighlevel.com',
            instructions: [
                "1. Log into your GHL dashboard",
                "2. Go to Contacts and find your clinic contact",
                "3. Create a subscription for the selected plan",
                "4. Set up payment processing",
                "5. Your app will automatically sync subscription status"
            ]
        };

        return NextResponse.json({ success: true, url: "/login" });

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

            // Note: GHL contact deletion might require manual cleanup
            if (ghlContact) {
                console.log("GHL contact created but clinic failed. Manual cleanup may be needed for contact ID:", ghlContact.id);
            }
        } catch (rollbackError) {
            console.log("Error during rollback:", rollbackError);
        }

        return NextResponse.json({ success: false, url: "/login", message: error.message }, { status: 400 });
    }
}