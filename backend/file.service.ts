import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// DO Spaces configuration
const DO_SPACES_ENDPOINT = 'https://lon1.digitaloceanspaces.com';
const DO_SPACES_BUCKET = 'hstengineer';
const DO_SPACES_REGION = 'lon1';

// CDN URL for serving files (user enabled CDN on DO Spaces)
const CDN_BASE = process.env.CDN_URL || `https://${DO_SPACES_BUCKET}.lon1.cdn.digitaloceanspaces.com`;

// S3 Client for direct uploads
const s3Client = new S3Client({
    region: DO_SPACES_REGION,
    endpoint: DO_SPACES_ENDPOINT,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || '',
    },
    forcePathStyle: false, // Use virtual-hosted-style URLs
});

// Extract project ID from VITE_API_URL (e.g., https://99e64c70-154c-42eb-ae25-d2b6c2d0f761-app.joylo.io)
function getProjectId(): string {
    const apiUrl = process.env.VITE_API_URL || '';
    const match = apiUrl.match(/https?:\/\/([a-f0-9-]+)-app\.joylo\.io/);
    return match ? match[1] : 'unknown';
}

// Allowed media types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// File interface matching multer's file structure
export interface UploadedFile {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export interface SavedFile {
    url: string;
    key: string;
    type: 'image' | 'video';
    filename: string;
}

/**
 * Validate uploaded file type and size
 */
export function validateFile(file: UploadedFile): FileValidationResult {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed: images (jpeg, png, gif, webp) and videos (mp4, webm)`
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size: 50MB`
        };
    }

    return { valid: true };
}

/**
 * Upload file directly to DO Spaces with public-read ACL
 * Returns CDN URL for immediate access
 */
export async function saveFile(
    file: UploadedFile,
    folder: string = 'media'
): Promise<SavedFile> {
    const projectId = getProjectId();

    // Create safe filename
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '')}`;

    // S3 key: generated_projects/{project_id}/uploads/{folder}/{filename}
    const key = `generated_projects/${projectId}/uploads/${folder}/${safeName}`;
    const type = file.mimetype.startsWith('video/') ? 'video' : 'image';

    try {
        // Upload directly to S3 with public-read ACL
        const command = new PutObjectCommand({
            Bucket: DO_SPACES_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        });

        await s3Client.send(command);
        console.log(`Uploaded to S3 with public-read ACL: ${key}`);

        // Return CDN URL for immediate access
        return {
            url: `${CDN_BASE}/${key}`,
            key,
            type,
            filename: safeName,
        };
    } catch (error) {
        console.error('Failed to upload to S3:', error);
        throw new Error('Failed to upload file to storage');
    }
}

/**
 * Delete file from DO Spaces
 */
export async function deleteFile(key: string): Promise<boolean> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: DO_SPACES_BUCKET,
            Key: key,
        });

        await s3Client.send(command);
        console.log(`Deleted from S3: ${key}`);
        return true;
    } catch (error) {
        console.error('Failed to delete from S3:', error);
        return false;
    }
}

/**
 * Replace existing file with new one
 * Deletes old file and saves new one
 */
export async function replaceFile(
    oldKey: string | null | undefined,
    newFile: UploadedFile,
    folder: string = 'media'
): Promise<SavedFile> {
    // Delete old file if exists
    if (oldKey) {
        await deleteFile(oldKey);
    }

    // Save new file
    return saveFile(newFile, folder);
}
