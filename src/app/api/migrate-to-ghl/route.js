import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { subscriptionRepo } from "@/app/lib/db/subscriptionRepo";
import { ghlApi, getGHLProductByPlanId, createGHLSubscriptionUrl } from "@/app/lib/api/ghl";
import authOptions from "@/app/lib/authoption";

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Only allow admin users to perform migration
    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    const { clinicId, action } = await request.json();

    if (!clinicId || !action) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    try {
        switch (action) {
            case 'migrate':
                return await migrateClinicToGHL(clinicId);
            case 'bulk-migrate':
                return await bulkMigrateToGHL();
            case 'check-status':
                return await checkMigrationStatus(clinicId);
            default:
                return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error('Migration Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function migrateClinicToGHL(clinicId) {
    // Get clinic details
    const clinic = await clinicRepo.getClinicById(clinicId);
    if (!clinic) {
        return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
    }

    // Get current subscription
    const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinicId);
    if (!subscriptionTier) {
        return NextResponse.json({ success: false, error: "No subscription found for clinic" }, { status: 404 });
    }

    // Check if already migrated
    if (subscriptionTier && subscriptionTier.subscriptionProvider === 'ghl') {
        return NextResponse.json({ success: false, error: "Clinic already has GHL subscription" }, { status: 400 });
    }

    try {
        // Create contact in GHL
        const contactName = clinic.primaryContact || clinic.name;
        const [firstName, ...lastNameParts] = contactName.split(' ');
        const lastName = lastNameParts.join(' ') || '';

        const ghlContact = await ghlApi.createContact({
            email: clinic.email,
            firstName: firstName,
            lastName: lastName,
            phone: clinic.phoneNumber,
            companyName: clinic.name,
            clinicId: clinic.id,
            role: 'clinic_admin',
        });

        // Update subscription tier to use GHL
        await subscriptionRepo.updateSubscriptionTierWithGHL(
            clinicId,
            subscriptionTier.planId,
            null, // No GHL subscription ID yet
            ghlContact.id,
            subscriptionTier.isActive
        );

        // Create subscription URL for GHL
        const subscriptionUrl = createGHLSubscriptionUrl(clinicId, subscriptionTier.planId, ghlContact.id);

        return NextResponse.json({
            success: true,
            message: "Clinic set up with GHL successfully",
            subscriptionUrl,
            ghlContactId: ghlContact.id,
            clinic: {
                id: clinic.id,
                name: clinic.name,
                email: clinic.email,
            }
        });

    } catch (error) {
        console.error('Error migrating clinic to GHL:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function bulkMigrateToGHL() {
    try {
        // Get all clinics without GHL subscriptions
        const clinics = await clinicRepo.getAllClinics();
        const migrationResults = [];

        for (const clinic of clinics) {
            const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);

            if (!subscriptionTier || subscriptionTier.subscriptionProvider !== 'ghl') {
                try {
                    const result = await migrateClinicToGHL(clinic.id);
                    migrationResults.push({
                        clinicId: clinic.id,
                        clinicName: clinic.name,
                        success: result.success,
                        message: result.message || result.error,
                    });
                } catch (error) {
                    migrationResults.push({
                        clinicId: clinic.id,
                        clinicName: clinic.name,
                        success: false,
                        message: error.message,
                    });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Bulk GHL setup completed",
            results: migrationResults,
        });

    } catch (error) {
        console.error('Error in bulk migration:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

async function checkMigrationStatus(clinicId) {
    try {
        const clinic = await clinicRepo.getClinicById(clinicId);
        if (!clinic) {
            return NextResponse.json({ success: false, error: "Clinic not found" }, { status: 404 });
        }

        const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinicId);
        if (!subscriptionTier) {
            return NextResponse.json({
                success: true,
                status: "no_subscription",
                message: "No subscription found for this clinic"
            });
        }

        let ghlDetails = null;
        if (subscriptionTier.subscriptionProvider === 'ghl' && subscriptionTier.ghlSubscriptionId) {
            try {
                ghlDetails = await ghlApi.getSubscription(subscriptionTier.ghlSubscriptionId);
            } catch (error) {
                console.error('Error fetching GHL subscription details:', error);
            }
        }

        return NextResponse.json({
            success: true,
            status: subscriptionTier.subscriptionProvider,
            subscription: {
                ...subscriptionTier,
                ghlDetails
            },
            clinic: {
                id: clinic.id,
                name: clinic.name,
                email: clinic.email,
            }
        });

    } catch (error) {
        console.error('Error checking migration status:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// GET endpoint to list all clinics and their migration status
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const email = session?.user?.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ success: false, error: "Admin access required" }, { status: 403 });
    }

    try {
        const clinics = await clinicRepo.getAllClinics();
        const migrationStatus = [];

        for (const clinic of clinics) {
            const subscriptionTier = await subscriptionRepo.getSubscriptionTier(clinic.id);

            migrationStatus.push({
                clinicId: clinic.id,
                clinicName: clinic.name,
                clinicEmail: clinic.email,
                subscriptionProvider: subscriptionTier?.subscriptionProvider || 'none',
                planId: subscriptionTier?.planId || null,
                isActive: subscriptionTier?.isActive || false,
                hasGHLContact: !!subscriptionTier?.ghlContactId,
                hasGHLSubscription: !!subscriptionTier?.ghlSubscriptionId,
            });
        }

        return NextResponse.json({
            success: true,
            clinics: migrationStatus,
        });

    } catch (error) {
        console.error('Error fetching migration status:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
} 