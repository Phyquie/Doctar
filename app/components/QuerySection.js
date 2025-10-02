'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

const queryItems = [
  {
    id: 1,
    label: "General Physician",
    icon: "/icons/general-physician.svg",
    specialization: "General Physician",
    apiValue: "general_physician"
  },
  {
    id: 2,
    label: "Cardiologist",
    icon: "/icons/cardiologist.svg",
    specialization: "Cardiologist",
    apiValue: "cardiology"
  },
  {
    id: 3,
    label: "Dentist",
    icon: "/icons/dentist.svg",
    specialization: "Dentist",
    apiValue: "dentistry"
  },
  {
    id: 4,
    label: "Gynecologist",
    icon: "/icons/gynecologist.svg",
    specialization: "Gynecologist",
    apiValue: "gynecology"
  },
  {
    id: 5,
    label: "Pediatrician",
    icon: "/icons/pediatrician.svg",
    specialization: "Pediatrician",
    apiValue: "pediatric"
  },
  {
    id: 6,
    label: "Dermatologist",
    icon: "/icons/dermatologist.svg",
    specialization: "Dermatologist",
    apiValue: "dermatology"
  },
  {
    id: 7,
    label: "Ayurveda",
    icon: "/icons/ayurveda.svg",
    specialization: "Ayurveda",
    apiValue: "ayurveda"
  },
  {
    id: 8,
    label: "Homeopathy",
    icon: "/icons/homeopathy.svg",
    specialization: "Homeopathy",
    apiValue: "homeopathy"
  }
];

export default function QuerySection() {
  const router = useRouter();
  const currentLocation = useAppSelector(selectCurrentLocation);
  const handleSpecializationClick = (specialization, apiValue) => {
    const locationSlug = currentLocation?.name || currentLocation?.city;
    
    // Generate specialization slug for URL (using display name)
    const specializationSlug = specialization.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    if (locationSlug) {
      const formattedLocation = locationSlug.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      // Pass apiValue as query parameter for backend API calls
      router.push(`/specialist/${specializationSlug}/${formattedLocation}`);
    } else {
      router.push(`/specialist/${specializationSlug}`);
    }
  };

  const displayLocation = currentLocation?.city || currentLocation?.name || 'Your Area';

  return (
    <section className="mt-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Find Specialists in {displayLocation}
          </h2>
          <button 
            onClick={() => {
              router.push('/specialist');
            }}
            className="text-[#5f4191] font-medium hover:text-[#4d3374] transition-colors"
          >
            View All Specialists
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {queryItems.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handleSpecializationClick(item.specialization, item.apiValue)}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 transition-all duration-300 border-2 border-gray-200 group-hover:border-[#5f4191] group-hover:border-4 group-hover:shadow-lg relative">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                  onError={(e) => {
                    console.log(`Failed to load icon: ${item.icon}`);
                    e.target.src = '/icons/general-physician.svg'; // Fallback to SVG icon
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center group-hover:text-[#5f4191] transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
