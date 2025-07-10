import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { resourceRepo } from "@/app/lib/db/resourceRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import http from 'http';

const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true,
    timeout: 30000,
    proxy: false
});
httpsAgent.on('error', (err) => {
    console.error('HTTPS Agent Error:', err);
});
const s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    },
    forcePathStyle: true,
    maxAttempts: 3,
    requestTimeout: 30000,
    connectTimeout: 10000,
    logger: console,
    tls: true,
    useDualstackEndpoint: false,
    useGlobalEndpoint: false,
    requestHandler: {
        httpsAgent
    }
});
const getCdnUrl = (filePath) => {
    if (process.env.DO_SPACES_CDN_ENABLED === 'true') {
        return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
    }
    return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
};

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const email = session.user.email;
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        let pdfs;
        if (user.role === "admin") {
            pdfs = await resourceRepo.getAllPDFs();
        }
        if (user.role === "clinic_admin") {
            pdfs = await resourceRepo.getAllPDFsForClinic();
        }
        if (user.role === "coach") {
            pdfs = await resourceRepo.getAllPDFsForCoach();
        }
        if (user.role === "client") {
            pdfs = await resourceRepo.getAllPDFsForClient();
        }
        return NextResponse.json({ status: true, pdfs });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('pdf');
        const title = formData.get('title');
        const role = formData.get('role');
        if (!file) {
            return NextResponse.json(
                { status: false, message: 'No file provided' },
                { status: 400 }
            );
        }
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `pdfs/${fileName}`;
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
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
        const saved = await resourceRepo.savePDF(title, role, 'PDF', url);
        return NextResponse.json({ status: true, pdf: saved });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
} 