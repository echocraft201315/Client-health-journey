import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db/postgresql";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {

    const { selectedClient } = await request.json();
    const client = await clientRepo.getClientById(selectedClient);
    if (!client) {
        return NextResponse.json({ status: false, message: "Client not found" }, { status: 404 });
    }
    const selfieImages = await sql`
    SELECT "image", "description", "date" FROM "SelfieImage" WHERE "email" = ${client.email} ORDER BY "date" DESC
  `;
    return NextResponse.json({ status: true, selfieImages });
}
