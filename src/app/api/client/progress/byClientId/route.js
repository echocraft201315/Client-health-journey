import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";
import { programRepo } from "@/app/lib/db/programRepo";
import { AIReviewRepo } from "@/app/lib/db/aiReviewRepo";


export async function POST(request) {
  try {
    const { clientId, current, timeRange } = await request.json();
    const email = await clientRepo.getEmailById(clientId);

    let progressData;
    if (timeRange) {
      // Use the existing getProgressdataByRange method for week/month options
      progressData = await clientRepo.getProgressdataByRange(email, timeRange);
    } else {
      // Use the current method for default behavior (7 days)
      progressData = await clientRepo.getProgressbyClient(email, current);
    }

    const start = await clientRepo.initialState(email);

    const aiReview = await AIReviewRepo.getReviewbyClientEmail(email)

    let program = null;
    try {
      program = await programRepo.getProgrambyClientEmail(email);
    } catch (error) {
      console.log("No program found for client:", error.message);
      // Continue without program data
    }

    const progress = {
      progressData,
      start,
      program,
      aiReview
    };

    return NextResponse.json({ status: true, progress });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: false,
      message: error.message || "An error occurred while fetching progress data"
    });
  }
}
