import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'doctar/general', transformation = 'profile') => {
  try {
    console.log('Uploading image to Cloudinary...', { folder, transformation });
    
    // Convert file to base64 if it's a buffer
    let base64Data;
    if (Buffer.isBuffer(file)) {
      base64Data = `data:image/jpeg;base64,${file.toString('base64')}`;
    } else if (typeof file === 'string') {
      base64Data = file;
    } else {
      throw new Error('Invalid file format');
    }

    // Define transformations based on type
    const transformations = {
      profile: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ],
      gallery: [
        { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
        { quality: 'auto' }
      ],
      thumbnail: [
        { width: 150, height: 150, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    };

    // Generate unique public ID based on folder and timestamp
    const timestamp = Date.now();
    const folderName = folder.split('/').pop() || 'general';
    const publicId = `${folderName}_${transformation}_${timestamp}`;

    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'image',
      transformation: transformations[transformation] || transformations.profile,
      public_id: publicId,
    });

    console.log('Image uploaded successfully:', result.secure_url);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    console.log('Deleting image from Cloudinary:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('Image deleted successfully');
      return { success: true };
    } else {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Generate signed upload URL for client-side uploads
export const generateSignedUploadUrl = (folder = 'doctar/patients') => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `patient_${timestamp}`;
    
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        public_id: publicId,
        transformation: 'w_400,h_400,c_fill,g_face,q_auto'
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      signature,
      timestamp,
      publicId,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder
    };
  } catch (error) {
    console.error('Error generating signed upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

export default cloudinary;
