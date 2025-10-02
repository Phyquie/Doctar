'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

export default function ImageGallery({
  images = [],
  onImageAdd,
  onImageRemove,
  maxImages = 10,
  folder = 'doctar/gallery',
  transformation = 'gallery',
  disabled = false,
  className = ''
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageAdd = (result) => {
    if (onImageAdd) {
      onImageAdd({
        url: result.imageUrl,
        publicId: result.publicId,
        caption: ''
      });
    }
  };

  const handleImageRemove = (publicId) => {
    if (onImageRemove) {
      onImageRemove(publicId);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.publicId || index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={image.url}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              {!disabled && (
                <button
                  onClick={() => handleImageRemove(image.publicId)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Caption */}
              {image.caption && (
                <p className="mt-2 text-xs text-gray-600 truncate">{image.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Image Button */}
      {images.length < maxImages && !disabled && (
        <div className="flex justify-center">
          <ImageUpload
            currentImage="/icons/add-image-placeholder.png"
            onImageUpload={handleImageAdd}
            size="large"
            shape="rounded"
            showUploadButton={true}
            uploadButtonPosition="center"
            folder={folder}
            transformation={transformation}
            disabled={isUploading}
            alt="Add Image"
            className="border-2 border-dashed border-gray-300 hover:border-[#5f4191] transition-colors"
          />
        </div>
      )}

      {/* Image Count */}
      <p className="text-sm text-gray-500 text-center">
        {images.length} / {maxImages} images
      </p>
    </div>
  );
}
