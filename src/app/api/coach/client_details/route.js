import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {

  try{
    const { selectedClient } = await request.json();
    const client = await clientRepo.getClientById(selectedClient);
    return NextResponse.json({ status: true, client });
  }
  catch(error){
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
