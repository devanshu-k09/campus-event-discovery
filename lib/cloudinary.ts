import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration is performed dynamically inside the upload utility function to ensure environment variables are fully loaded.

/**
 * Uploads a file buffer directly to Cloudinary using upload_stream.
 * It is fully serverless-compatible as it does not touch the local filesystem.
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'campus-pulse'
): Promise<{ secure_url: string; public_id: string }> {
  // Dynamically configure to prevent initialization ordering / hoisting issues
  cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
    secure: true,
  });

  return new Promise((resolve, reject) => {
    // If Cloudinary environment variables are missing, warn and reject early
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return reject(new Error('Cloudinary environment credentials are not configured.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned no result'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // End stream with the buffer data to start upload
    uploadStream.end(fileBuffer);
  });
}
