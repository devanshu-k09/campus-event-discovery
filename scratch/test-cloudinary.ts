import dotenv from 'dotenv';
import path from 'path';
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { uploadToCloudinary } from '../lib/cloudinary';
import { v2 as cloudinary } from 'cloudinary';

async function test() {
  console.log('Credentials:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET (length ' + process.env.CLOUDINARY_API_SECRET.length + ')' : 'MISSING'
  });

  console.log('Cloudinary Config inside lib:', cloudinary.config());

  // Create a tiny transparent 1x1 GIF buffer
  const gifBuffer = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );

  try {
    console.log('Uploading mock buffer...');
    const result = await uploadToCloudinary(gifBuffer, 'test-folder');
    console.log('Upload Result:', result);
  } catch (err) {
    console.error('Upload Error:', err);
  }
}

test();
