'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

const queryItems = [
  {
    id: 1,
    label: "General Physician",
    icon: "/icons/allopathic.png",
    specialization: "General Physician"
  },
  {
    id: 2,
    label: "Cardiologist",
    icon: "/icons/cardiologist.PNG",
    specialization: "Cardiologist"
  },
  {
    id: 3,
    label: "Dentist",
    icon: "/icons/dentist.png",
    specialization: "Dentist"
  },
  {
    id: 4,
    label: "Gynecologist",
    icon: "/icons/gimaecologist.PNG",
    specialization: "Gynecologist"
  },
  {
    id: 5,
    label: "Pediatrician",
    icon: "/icons/general physcisian.PNG",
    specialization: "Pediatrician"
  },
  {
    id: 6,
    label: "Dermatologist",
    icon: "/icons/allopathic.png",
    specialization: "Dermatologist"
  },
  {
    id: 7,
    label: "Ayurveda",
    icon: "/icons/ayurveda.png",
    specialization: "Ayurveda"
  },
  {
    id: 8,
    label: "Homeopathy",
    icon: "/icons/homeopathic.png",
    specialization: "Homeopathy"
  }
];

export default function QuerySection() {
  const router = useRouter();
  const currentLocation = useAppSelector(selectCurrentLocation);
  const handleSpecializationClick = (specialization) => {
    const locationSlug = currentLocation?.name || currentLocation?.city;
    
    // Generate specialization slug
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
              onClick={() => handleSpecializationClick(item.specialization)}
            >
              <div className="w-16 h-16 bg-[#5f4191] rounded-full flex items-center justify-center mb-3 hover:scale-105 transition-all duration-300 group-hover:bg-[#4d3374] group-hover:shadow-lg">
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={28}
                  height={28}
                  className="object-contain filter brightness-0 invert"
                  unoptimized
                  onError={(e) => {
                    console.log(`Failed to load icon: ${item.icon}`);
                    e.target.src = '/icons/icon.png'; // Fallback icon
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
