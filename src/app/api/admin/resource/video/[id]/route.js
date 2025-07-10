import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { resourceRepo } from "@/app/lib/db/resourceRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

const s3Client = new S3Client({
  region: process.env.DO_SPACES_REGION,
  endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const sessionEmail = session.user.email;
    const sessionUser = await userRepo.getUserByEmail(sessionEmail);
    if (!sessionUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get video details from database
    const video = await resourceRepo.getResourceById(id);
    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to access this video
    if (sessionUser.role === "coach" && video.role !== "coach") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Extract the key from the content URL
    const key = video.content.split(".com/")[1];

    // Get the video from DigitalOcean Spaces
    const getCommand = new GetObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(getCommand);
    const videoStream = response.Body;

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of videoStream) {
      chunks.push(chunk);
    }
    const videoBuffer = Buffer.concat(chunks);

    // Return the video file with appropriate headers
    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${video.title || 'video'}.mp4"`,
      },
    });
  } catch (error) {
    console.error("Error downloading video:", error);
    return NextResponse.json(
      { status: false, message: "Failed to download video" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const sessionEmail = session.user.email;
    const sessionUser = await userRepo.getUserByEmail(sessionEmail);
    if (!sessionUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (sessionUser.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get video details from database
    const video = await resourceRepo.getResourceById(id);
    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // Extract the key from the content URL
    const key = video.content.split(".com/")[1];

    // Delete from DigitalOcean Spaces
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    // Delete from database using resourceRepo
    const data = await resourceRepo.deleteResource(id);

    return NextResponse.json(
      { status: true, message: "Video deleted successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { status: false, message: "Failed to delete video" },
      { status: 500 }
    );
  }
} 