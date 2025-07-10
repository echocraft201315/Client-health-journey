import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.DO_SPACES_REGION,
    endpoint: `https://${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    },
});

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoUrl = searchParams.get("url");

        if (!videoUrl) {
            return NextResponse.json(
                { error: "Video URL is required" },
                { status: 400 }
            );
        }

        // Extract the key from the URL
        const key = videoUrl.split(".com/")[1];

        const command = new GetObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: key,
        });

        const response = await s3Client.send(command);
        const stream = response.Body;

        // Convert the stream to a buffer
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Set appropriate headers
        const headers = {
            "Content-Type": "video/mp4",
            "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
        };

        return new NextResponse(buffer, { headers });
    } catch (error) {
        console.error("Error downloading video:", error);
        return NextResponse.json(
            { error: "Failed to download video" },
            { status: 500 }
        );
    }
} 