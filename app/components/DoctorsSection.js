'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function DoctorsSection() {
  const router = useRouter();
  const currentLocation = useAppSelector(selectCurrentLocation);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors based on current location
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        
        // Build API URL with location filter
        const params = new URLSearchParams({
          limit: '8', // Show 8 doctors in homepage
          page: '1',
          sortBy: 'rating' // Show top-rated doctors first
        });

        // Add location filter if available
        if (currentLocation?.name || currentLocation?.city) {
          const locationName = currentLocation.city || currentLocation.name;
          params.append('location', locationName);
        }

        const response = await fetch(`/api/doctors?${params}`);
        const data = await response.json();

        if (response.ok) {
          setDoctors(data.doctors || []);
        } else {
          console.error('Failed to fetch doctors:', data.error);
          // Fallback to showing some doctors without location filter
          const fallbackResponse = await fetch('/api/doctors?limit=8&page=1&sortBy=rating');
          const fallbackData = await fallbackResponse.json();
          if (fallbackResponse.ok) {
            setDoctors(fallbackData.doctors || []);
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentLocation]);

  // Helper function to generate public URL
  const generatePublicUrl = (doctor) => {
    if (doctor.publicUrl) return doctor.publicUrl;
    
    const locationSlug = doctor.location.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    const slug = doctor.slug || `${doctor.name.replace('Dr. ', '')}`.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + doctor.specialization.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    return `/doctors/${locationSlug}/${slug}`;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const displayLocation = currentLocation?.city || currentLocation?.name || 'Your Area';

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
          
          {/* Loading Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-4">
                <div className="animate-pulse flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Top Doctors in {displayLocation} {doctors.length > 0 && `(${doctors.length} shown)`}
          </h2>
          <button 
            onClick={() => {
              const locationSlug = currentLocation?.name || currentLocation?.city;
              if (locationSlug) {
                const formattedLocation = locationSlug.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim('-');
                router.push(`/doctors/${formattedLocation}`);
              } else {
                router.push('/doctors');
              }
            }}
            className="text-[#5f4191] font-medium hover:text-[#4d3374] transition-colors"
          >
            View All
          </button>
        </div>
        
        {doctors.length > 0 ? (
          /* Horizontal Scrollable Cards */
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {doctors.map((doctor) => (
              <div 
                key={doctor.id} 
                className="flex-shrink-0 w-80 bg-white border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => router.push(generatePublicUrl(doctor))}
              >
                <div className="flex items-start space-x-4">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0 justify-center relative">
                    <Image
                      src={doctor.avatar || '/icons/doctor.png'}
                      alt={doctor.name}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover border-2 border-gray-100 group-hover:border-[#5f4191] transition-colors"
                      style={{ width: '100px', height: '120px' }}
                      unoptimized
                      onError={(e) => {
                        console.log(`Failed to load doctor avatar: ${doctor.avatar}`);
                        e.target.src = '/icons/doctor.png';
                      }}
                      
                    />
                    {doctor.isVerified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#5f4191] transition-colors">
                      {doctor.name}
                    </h3>
                    
                    {/* Specialization with Icon */}
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-[#5f4191] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">{doctor.specialization}</span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex items-center space-x-1 mr-2">
                        {renderStars(doctor.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                      </span>
                    </div>
                    
                    {/* Experience and Fee */}
                    <div className="flex items-center justify-between">
                      <span className="bg-[#5f4191]/90 text-white text-xs px-2 py-1 rounded-full">
                        {doctor.experience} years exp.
                      </span>
                      <span className="text-lg font-bold text-[#5f4191]">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Doctors Found */
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Doctors Found in {displayLocation}
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find any doctors in your selected location. Try browsing all doctors.
            </p>
            <button
              onClick={() => router.push('/doctors')}
              className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Browse All Doctors
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
