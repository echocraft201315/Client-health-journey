import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { resourceRepo } from "@/app/lib/db/resourceRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { S3Client, PutObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';
import http from 'http';

// Create a custom HTTPS agent with debug logging
const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true,
    timeout: 30000,
    proxy: false
});

// Add debug logging to the agent
httpsAgent.on('error', (err) => {
    console.error('HTTPS Agent Error:', err);
});

// Initialize S3 client for DigitalOcean Spaces
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

// Test the connection
const testConnection = async () => {
    try {
        const endpoint = `${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`;
        console.log('Testing connection to:', `https://${endpoint}`);

        // First try a simple HTTP request to test connectivity
        console.log('Testing basic HTTP connectivity...');
        await new Promise((resolve, reject) => {
            const req = http.get({
                host: endpoint,
                port: 80,
                timeout: 5000,
            }, (res) => {
                console.log('HTTP test response:', res.statusCode);
                resolve();
            });
            req.on('error', (error) => {
                console.error('HTTP test error:', error);
                reject(error);
            });
        });

        // Then try HTTPS
        console.log('Testing HTTPS connectivity...');
        await new Promise((resolve, reject) => {
            const req = https.get({
                host: endpoint,
                port: 443,
                timeout: 5000,
            }, (res) => {
                console.log('HTTPS test response:', res.statusCode);
                resolve();
            });
            req.on('error', (error) => {
                console.error('HTTPS test error:', error);
                reject(error);
            });
        });

        // Finally try the S3 connection
        console.log('Testing S3 connection...');
        const bucketCommand = new HeadBucketCommand({
            Bucket: process.env.DO_SPACES_BUCKET
        });
        await s3Client.send(bucketCommand);
        console.log('Successfully accessed bucket:', process.env.DO_SPACES_BUCKET);
    } catch (error) {
        console.error('Failed to connect to DigitalOcean Spaces:', {
            error: error.message,
            code: error.code,
            endpoint: `https://${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`,
            region: process.env.DO_SPACES_REGION,
            hasKey: !!process.env.DO_SPACES_KEY,
            hasSecret: !!process.env.DO_SPACES_SECRET,
            bucket: process.env.DO_SPACES_BUCKET
        });
    }
};

// Run the test
testConnection();

// Log configuration (without sensitive data)
console.log('S3 Client Configuration:', {
    endpoint: `https://${process.env.DO_SPACES_REGION}.${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION,
    bucket: process.env.DO_SPACES_BUCKET,
    hasKey: !!process.env.DO_SPACES_KEY,
    hasSecret: !!process.env.DO_SPACES_SECRET,
});

// Helper function to generate CDN URL
const getCdnUrl = (filePath) => {
    // If CDN is enabled, use the CDN domain
    if (process.env.DO_SPACES_CDN_ENABLED === 'true') {
        return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.${process.env.DO_SPACES_ENDPOINT}/${filePath}`;
    }
    // Fallback to regular Space URL
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
        let videos;
        if (user.role === "admin") {
            videos = await resourceRepo.getAllVideos();
        }
        if (user.role === "clinic_admin") {
            videos = await resourceRepo.getAllVideosForClinic();
        }
        if (user.role === "coach") {
            videos = await resourceRepo.getAllVideosForCoach();
        }

        return NextResponse.json({ status: true, videos });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('video');
        const title = formData.get('title');
        const role = formData.get('role');

        if (!file) {
            return NextResponse.json(
                { status: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `videos/${fileName}`;

        console.log('Preparing to upload file:', {
            fileName,
            filePath,
            fileSize: file.size,
            fileType: file.type
        });

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
            CacheControl: 'max-age=31536000', // Cache for 1 year
        });

        try {
            console.log('Sending upload command...');
            await s3Client.send(command);
            console.log('Upload successful');

            // Generate public URL using CDN if enabled
            const publicUrl = getCdnUrl(filePath);
            console.log('Generated public URL:', publicUrl);

            // Save to database
            const video = await resourceRepo.saveVideo(
                title,
                role,
                "Video",
                publicUrl
            );

            return NextResponse.json({
                status: true,
                message: 'Video uploaded successfully',
                data: {
                    url: publicUrl,
                    filename: fileName,
                    video
                },
            });
        } catch (uploadError) {
            console.error('Upload error details:', {
                error: uploadError,
                message: uploadError.message,
                code: uploadError.code,
                endpoint: s3Client.config.endpoint,
                bucket: process.env.DO_SPACES_BUCKET,
                fileSize: file.size,
                fileType: file.type
            });
            throw uploadError;
        }
    } catch (error) {
        console.error('Upload error:', {
            error: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json(
            {
                status: false,
                message: 'Failed to upload video',
                error: error.message
            },
            { status: 500 }
        );
    }
}