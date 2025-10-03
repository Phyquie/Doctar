'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Mock data for shorts
    const mockShorts = [
      {
        id: 1,
        title: "5 Tips for Better Sleep",
        thumbnail: "/icons/shorts-thumbnail-1.jpg",
        duration: "0:45",
        views: "12.5K",
        likes: "1.2K",
        doctor: "Dr. Sarah Johnson",
        specialization: "Sleep Medicine"
      },
      {
        id: 2,
        title: "Healthy Breakfast Ideas",
        thumbnail: "/icons/shorts-thumbnail-2.jpg",
        duration: "0:30",
        views: "8.7K",
        likes: "890",
        doctor: "Dr. Michael Chen",
        specialization: "Nutrition"
      },
      {
        id: 3,
        title: "Quick Stress Relief",
        thumbnail: "/icons/shorts-thumbnail-3.jpg",
        duration: "1:00",
        views: "15.2K",
        likes: "2.1K",
        doctor: "Dr. Emily Rodriguez",
        specialization: "Mental Health"
      },
      {
        id: 4,
        title: "Exercise for Office Workers",
        thumbnail: "/icons/shorts-thumbnail-4.jpg",
        duration: "0:50",
        views: "6.8K",
        likes: "750",
        doctor: "Dr. James Wilson",
        specialization: "Physical Therapy"
      },
      {
        id: 5,
        title: "Hydration Tips",
        thumbnail: "/icons/shorts-thumbnail-5.jpg",
        duration: "0:40",
        views: "9.3K",
        likes: "1.1K",
        doctor: "Dr. Lisa Park",
        specialization: "General Medicine"
      },
      {
        id: 6,
        title: "Eye Care for Screen Time",
        thumbnail: "/icons/shorts-thumbnail-6.jpg",
        duration: "0:55",
        views: "11.4K",
        likes: "1.5K",
        doctor: "Dr. David Kim",
        specialization: "Ophthalmology"
      }
    ];

    setShorts(mockShorts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Health Shorts
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6">
              Quick health tips and insights from our medical experts
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Expert Videos</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Quick Tips</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Health & Wellness</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shorts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {shorts.map((short) => (
            <div key={short.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] rounded-t-xl overflow-hidden">
                <Image
                  src={short.thumbnail}
                  alt={short.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/icons/doctor.png';
                  }}
                />
                
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {short.duration}
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#5f4191] transition-colors">
                  {short.title}
                </h3>
                
                {/* Doctor Info */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-[#5f4191] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {short.doctor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">{short.doctor}</p>
                    <p className="text-xs text-[#5f4191] truncate">{short.specialization}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{short.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{short.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors text-sm sm:text-base font-medium">
            Load More Shorts
          </button>
        </div>
      </div>
    </div>
  );
}

