'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function SpecialistPage() {
  const router = useRouter();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Specializations with icons and descriptions
    const specializationsData = [
      {
        name: 'Cardiologist',
        icon: '/icons/cardiologist.svg',
        description: 'Heart and cardiovascular system specialists',
        color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
      },
      {
        name: 'Dermatologist',
        icon: '/icons/dermatologist.svg',
        description: 'Skin, hair, and nail specialists',
        color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100'
      },
      {
        name: 'Endocrinologist',
        icon: '/icons/endocrinologist.svg',
        description: 'Hormone and diabetes specialists',
        color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
      },
      {
        name: 'Gastroenterologist',
        icon: '/icons/gastroenterologist.svg',
        description: 'Digestive system specialists',
        color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
      },
      {
        name: 'Gynecologist',
        icon: '/icons/gynecologist.svg',
        description: 'Women\'s health specialists',
        color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
      },
      {
        name: 'Neurologist',
        icon: '/icons/neurologist.svg',
        description: 'Brain and nervous system specialists',
        color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
      },
      {
        name: 'Oncologist',
        icon: '/icons/oncologist.svg',
        description: 'Cancer treatment specialists',
        color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
      },
      {
        name: 'Ophthalmologist',
        icon: '/icons/ophthalmologist.svg',
        description: 'Eye and vision specialists',
        color: 'bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100'
      },
      {
        name: 'Orthopedist',
        icon: '/icons/orthopedist.svg',
        description: 'Bone and joint specialists',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
      },
      {
        name: 'Pediatrician',
        icon: '/icons/pediatrician.svg',
        description: 'Children\'s health specialists',
        color: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
      },
      {
        name: 'Psychiatrist',
        icon: '/icons/psychiatrist.svg',
        description: 'Mental health specialists',
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
      },
      {
        name: 'Pulmonologist',
        icon: '/icons/pulmonologist.svg',
        description: 'Lung and respiratory specialists',
        color: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
      },
      {
        name: 'Urologist',
        icon: '/icons/urologist.svg',
        description: 'Urinary system specialists',
        color: 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
      },
      {
        name: 'General Physician',
        icon: '/icons/general-physician.svg',
        description: 'Primary healthcare specialists',
        color: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
      },
      {
        name: 'Dentist',
        icon: '/icons/dentist.svg',
        description: 'Oral and dental health specialists',
        color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
      },
      {
        name: 'Ayurveda',
        icon: '/icons/ayurveda.svg',
        description: 'Traditional Indian medicine specialists',
        color: 'bg-lime-50 border-lime-200 text-lime-700 hover:bg-lime-100'
      },
      {
        name: 'Homeopathy',
        icon: '/icons/homeopathy.svg',
        description: 'Homeopathic medicine specialists',
        color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
      },
      {
        name: 'Physiotherapist',
        icon: '/icons/physiotherapist.svg',
        description: 'Physical therapy and rehabilitation specialists',
        color: 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
      }
    ];
    
    setSpecializations(specializationsData);
    setLoading(false);
  }, []);

  // Filter specializations based on search
  const filteredSpecializations = specializations.filter(spec =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate URL for specialization
  const generateSpecializationUrl = (specialization) => {
    const slug = specialization.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    return `/specialist/${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Medical Specialists | Find Doctors by Specialization | Doctar</title>
        <meta name="description" content="Browse medical specialists by specialization. Find qualified doctors in cardiology, dermatology, neurology, and more medical fields." />
        <meta name="keywords" content="medical specialists, doctors by specialization, cardiologist, dermatologist, neurologist, medical fields" />
        <meta property="og:title" content="Medical Specialists | Doctar" />
        <meta property="og:description" content="Find qualified medical specialists in various fields. Browse by specialization to find the right doctor for your needs." />
        <link rel="canonical" href="https://doctar.in/specialist" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-[#5f4191]">Home</Link></li>
              <li>/</li>
              <li className="text-gray-900">Specialists</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Medical Specialists
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Find qualified doctors by their medical specialization
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search specializations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredSpecializations.map((specialization, index) => (
              <Link
                key={specialization.name}
                href={generateSpecializationUrl(specialization)}
                className="group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className={`
                  bg-white rounded-xl shadow-sm hover:shadow-xl 
                  transition-all duration-500 ease-out
                  p-6 border-2 ${specialization.color} 
                  group-hover:scale-105 group-hover:-translate-y-2
                  h-64 flex flex-col justify-between
                  transform hover:rotate-1
                  backdrop-blur-sm
                `}>
                  <div className="flex flex-col items-center text-center flex-grow">
                    {/* Icon */}
                    <div className="w-16 h-16 mb-4 relative group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={specialization.icon}
                        alt={specialization.name}
                        fill
                        className="object-contain filter group-hover:brightness-110"
                      />
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#5f4191] transition-colors duration-300 min-h-[3.5rem] flex items-center">
                      {specialization.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow flex items-center min-h-[2.5rem]">
                      {specialization.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex items-center justify-center text-sm font-medium group-hover:text-[#5f4191] transition-all duration-300 mt-auto pt-4 pb-3 px-6 border-t border-gray-100 group-hover:border-[#5f4191] group-hover:border-opacity-30">
                    <span className="group-hover:font-semibold transition-all duration-300">Find Doctors</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* No Results */}
          {filteredSpecializations.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Specializations Found</h3>
              <p className="text-gray-600 mb-4">
                No specializations match your search criteria. Try a different search term.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
