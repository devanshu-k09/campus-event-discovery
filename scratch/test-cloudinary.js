const { uploadToCloudinary } = require('../lib/cloudinary');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function test() {
  console.log('Credentials:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET (length ' + process.env.CLOUDINARY_API_SECRET.length + ')' : 'MISSING'
  });

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
