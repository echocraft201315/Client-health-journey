import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {
  const { clientId,startDate,endDate } = await request.json();
  try {
    const client = await clientRepo.getClientById(clientId);
    if (!client) {
      return NextResponse.json({ status: false, message: "Client not found" });
    }

      const checkIns = await clientRepo.getCheckInsbyRange(client.email,startDate,endDate);
      const weight = await clientRepo.getWeightByClientId(clientId,client.email);
      const result = {
        checkIns:checkIns,
        weight:weight
      }
      return NextResponse.json({ status: true, result });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
}