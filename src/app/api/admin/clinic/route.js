import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { clinicRepo } from "@/app/lib/db/clinicRepo";
import { sendClinicRegistrationEmail } from "@/app/lib/api/email";
import { ghlApi } from "@/app/lib/api/ghl";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const email = session.user.email;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const clinics = await clientRepo.getClinics();
        console.log("clinics", clinics[0].coachesCount);
        return NextResponse.json({ status: true, clinics });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}



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
        hipaaAcknowledgment,
        legalAcknowledgment,
        selectedPlan,
        addOns,
    } = await request.json();

    if (!clinicName || !clinicEmail || !clinicPhone || !streetAddress || !city || !state || !zipCode || !primaryContact || !email || !hipaaAcknowledgment || !legalAcknowledgment ) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    let clinic = null;
    let adminUser = null;
    const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    try {
        // Create contact in GHL
        const contactName = primaryContact || clinicName;
        const [firstName, ...lastNameParts] = contactName.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        const ghlContact = await ghlApi.createContact({
            email: clinicEmail,
            firstName: firstName,
            lastName: lastName,
            phone: clinicPhone,
            companyName: clinicName,
            clinicId: null, // Will be updated after clinic creation
            role: 'clinic_admin',
        });
        
        // Create clinic
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
        
        // Update GHL contact with clinic ID
        await ghlApi.updateContact(ghlContact.id, {
            customFields: {
                clinicId: clinic.id,
            }
        });
        

        // Create admin user
        adminUser = await userRepo.createAdminUser(
            primaryContact,
            email,
            clinicPhone,
            "clinic_admin",
            password,
            clinic.id
        );
        await sendClinicRegistrationEmail(clinicEmail, clinicName, clinicPhone, email, password);
        return NextResponse.json({ success: true, message: "Clinic created successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        // Rollback in reverse order
        try {

            // Delete admin user if created
            if (adminUser) {
                await userRepo.deleteAdminUser(adminUser.id);
            }

            // Delete clinic if created
            if (clinic) {
                await clinicRepo.deleteClinic(clinic.id);
            }
        } catch (rollbackError) {
            console.error("Error during rollback:", rollbackError);
        }

        return NextResponse.json({ success: false, message: "Error creating clinic" }, { status: 500 });
    }
}