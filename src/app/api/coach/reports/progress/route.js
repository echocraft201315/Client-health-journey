import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const timeRange = searchParams.get("timeRange");
    try {
        const client = await clientRepo.getClientById(clientId);
        if (!client) {
            return NextResponse.json({ status: false, message: "Client not found" });
        }

        const progress = await clientRepo.getProgressdataByRange(client.email, timeRange);
        return NextResponse.json({ status: true, progress });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message });
    }
}