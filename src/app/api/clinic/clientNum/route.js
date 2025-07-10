import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";

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
        if (user.role !== "clinic_admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const clinicId = user.clinic;
        const clients = await clientRepo.getnumclientsbyClinicId(clinicId);
        return NextResponse.json({ status: true, clients });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
export async function POST(request) {
  const { clinicId} = await request.json();
  try {
    const clientNum = await clientRepo.getClinentNum(clinicId);

    return NextResponse.json({ status: true, clientNum });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}


