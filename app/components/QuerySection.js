'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

const queryItems = [
  {
    id: 1,
    label: "Allopathic",
    icon: "/icons/general-physician.svg",
    specialization: "Allopathic",
    apiValue: "allopathic"
  },
  {
    id: 2,
    label: "Ayurveda",
    icon: "/icons/ayurveda.svg",
    specialization: "Ayurveda",
    apiValue: "ayurveda"
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
    label: "Homeopathy",
    icon: "/icons/homeopathy.svg",
    specialization: "Homeopathy",
    apiValue: "homeopathy"
  },
  {
    id: 5,
    label: "Cardiologist",
    icon: "/icons/cardiologist.svg",
    specialization: "Cardiologist",
    apiValue: "cardiology"
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
    label: "Neurologist",
    icon: "/icons/neurologist.svg",
    specialization: "Neurologist",
    apiValue: "neurology"
  },
  {
    id: 8,
    label: "Orthopedist",
    icon: "/icons/orthopedist.svg",
    specialization: "Orthopedist",
    apiValue: "orthopedics"
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
    <section className="w-full max-w-full">
      {/* Section Header */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Find Specialists in {displayLocation}
          </h2>
          <button
            onClick={() => router.push('/specialist')}
            className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors"
          >
            All
          </button>
        </div>
      </div>

      {/* Query Items Grid */}
      <div className="px-4 w-full max-w-full">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 md:gap-6 lg:gap-8 xl:gap-10">
          {queryItems.map((item) => (
            <div key={item.id} className="flex justify-center">
              <button
                onClick={() => handleSpecializationClick(item.specialization, item.apiValue)}
                className="flex flex-col items-center focus:outline-none group"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-105">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={60}
                    height={60}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 object-contain"
                    unoptimized
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-white text-xl sm:text-2xl">🏥</div>';
                    }}
                  />
                </div>
                <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium mt-2 group-hover:text-[#7551B2] transition-colors duration-300 text-center max-w-[70px] sm:max-w-[80px] md:max-w-none px-2 pb-3">
                  {item.label}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
