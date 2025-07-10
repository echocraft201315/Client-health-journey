import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { sql } from "@/app/lib/db/postgresql";

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    },
    forcePathStyle: true,
});

// Helper function to generate CDN URL
const getCdnUrl = (filePath) => {
    if (process.env.DO_SPACES_CDN_ENABLED === 'true') {
        return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
    }
    return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
};

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const formData = await request.formData();
        const file = formData.get('image');
        const description = formData.get('description') || "";
        const date = formData.get('date') || new Date();
        if (!file) {
            return NextResponse.json(
                { status: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `images/${fileName}`;

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Upload to DigitalOcean Spaces
        const command = new PutObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: filePath,
            Body: fileBuffer,
            ContentType: file.type,
            ACL: 'public-read',
            ContentLength: file.size,
            CacheControl: 'max-age=31536000',
        });

        await s3Client.send(command);
        const url = getCdnUrl(filePath);
        await sql`
            INSERT INTO "SelfieImage" ("email", "image", "description", "date") VALUES (${session.user.email}, ${url}, ${description}, ${date})
        `;
        return NextResponse.json({ status: true, url, description, date });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: false, message: error.message || "Failed to upload image" }, { status: 500 });
    }
} 