'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload({
  currentImage = '/icons/user-placeholder.png',
  onImageUpload,
  onImageChange,
  size = 'medium', // small, medium, large
  shape = 'circle', // circle, square, rounded
  showUploadButton = true,
  uploadButtonPosition = 'bottom-right', // bottom-right, top-right, center
  folder = 'doctar/general',
  transformation = 'profile',
  disabled = false,
  className = '',
  alt = 'Profile Image'
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(currentImage);

  // Size configurations
  const sizeConfig = {
    small: { container: 'w-8 h-8', button: 'w-4 h-4', icon: 'w-2 h-2' },
    medium: { container: 'w-12 h-12', button: 'w-6 h-6', icon: 'w-3 h-3' },
    large: { container: 'w-20 h-20', button: 'w-8 h-8', icon: 'w-4 h-4' }
  };

  // Shape configurations
  const shapeConfig = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  // Upload button position configurations
  const positionConfig = {
    'bottom-right': '-bottom-1 -right-1',
    'top-right': '-top-1 -right-1',
    'center': 'inset-0'
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (5MB limit for all images)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);
      formData.append('transformation', transformation);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      // Update preview immediately
      setPreviewImage(result.imageUrl);

      // Call the callback functions
      if (onImageUpload) {
        onImageUpload(result);
      }
      if (onImageChange) {
        onImageChange(result.imageUrl, result.publicId);
      }

    } catch (error) {
      console.error('Image upload error:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Image Container */}
      <div className={`${sizeConfig[size].container} ${shapeConfig[shape]} overflow-hidden bg-gray-200`}>
        <Image
          src={previewImage}
          alt={alt}
          width={size === 'small' ? 32 : size === 'medium' ? 48 : 80}
          height={size === 'small' ? 32 : size === 'medium' ? 48 : 80}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>

      {/* Upload Button */}
      {showUploadButton && !disabled && (
        <label className={`absolute ${positionConfig[uploadButtonPosition]} ${sizeConfig[size].button} bg-[#5f4191] ${shapeConfig[shape]} flex items-center justify-center cursor-pointer hover:bg-[#4d3374] transition-colors`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className={`${sizeConfig[size].icon} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
          ) : (
            <svg className={`${sizeConfig[size].icon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </label>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute -bottom-6 left-0 right-0 text-xs text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
