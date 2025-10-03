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
      <div className="px-4">
        <h2 className="text-lg font-bold mb-4">
          {currentLocation?.city || currentLocation?.name ? `Finding doctors in ${currentLocation.city || currentLocation.name}...` : 'Finding doctors near you...'}
        </h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[300px] h-32 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      {/* Header with retry button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          Doctors in {displayLocation}
          {doctors.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({doctors.length} found)
            </span>
          )}
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
          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          All
        </button>
      </div>

      {/* Doctors list */}
      {doctors.length > 0 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => router.push(generatePublicUrl(doctor))}
              className="min-w-[300px] p-2 flex items-center border-2 border-blue-500 rounded-xl bg-white overflow-hidden hover:shadow-lg transition cursor-pointer"
            >
              {/* Right: Image */}
              <div className="w-28 h-28 flex-shrink-0">
                <Image
                  src={doctor.avatar || '/icons/doctor.png'}
                  alt={doctor.name}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized
                  onError={(e) => {
                    console.log(`Failed to load doctor avatar: ${doctor.avatar}`);
                    e.target.src = '/icons/doctor.png';
                  }}
                />
              </div>

              {/* Left: Text */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{doctor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-[#5f4191]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{doctor.specialization}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                  <span>English, Hindi</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {doctor.experience}+ years Experience
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-semibold">
                    {doctor.rating && doctor.rating > 0 ? `${Number(doctor.rating).toFixed(1)}/5 Rating` : 'New Doctor'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state (when no error but no doctors) */}
      {!loading && doctors.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-4xl mb-3">🏥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Doctors Found</h3>
          <p className="text-gray-600 text-sm mb-4">
            We couldn't find any doctors in {displayLocation}
          </p>
          <p className="text-gray-500 text-xs">
            Try selecting a nearby city or check back later
          </p>
        </div>
      )}
    </div>
  );
}
