import Head from 'next/head';
import Link from 'next/link';

export default function HealthcareDirectoryPage() {
  const categories = [
    {
      name: "Primary Care",
      description: "General practitioners and family medicine doctors",
      count: "1,250+ doctors",
      icon: "🩺"
    },
    {
      name: "Cardiology",
      description: "Heart and cardiovascular specialists",
      count: "450+ doctors",
      icon: "❤️"
    },
    {
      name: "Dermatology",
      description: "Skin, hair, and nail specialists",
      count: "320+ doctors",
      icon: "🧴"
    },
    {
      name: "Orthopedics",
      description: "Bone, joint, and muscle specialists",
      count: "680+ doctors",
      icon: "🦴"
    },
    {
      name: "Pediatrics",
      description: "Children's health specialists",
      count: "890+ doctors",
      icon: "👶"
    },
    {
      name: "Mental Health",
      description: "Psychiatrists and psychologists",
      count: "560+ doctors",
      icon: "🧠"
    },
    {
      name: "Gynecology",
      description: "Women's health specialists",
      count: "420+ doctors",
      icon: "👩"
    },
    {
      name: "Neurology",
      description: "Brain and nervous system specialists",
      count: "340+ doctors",
      icon: "🧠"
    }
  ];

  const featuredHospitals = [
    {
      name: "City General Hospital",
      location: "Downtown Medical District",
      specialties: ["Emergency", "Surgery", "Cardiology"],
      rating: 4.8,
      distance: "2.3 miles"
    },
    {
      name: "Regional Medical Center",
      location: "Suburban Health Campus",
      specialties: ["Pediatrics", "Orthopedics", "Oncology"],
      rating: 4.6,
      distance: "5.7 miles"
    },
    {
      name: "University Hospital",
      location: "Medical School Campus",
      specialties: ["Research", "Teaching", "Specialized Care"],
      rating: 4.9,
      distance: "8.2 miles"
    }
  ];

  return (
    <>
      <Head>
        <title>Healthcare Directory - Doctar</title>
        <meta name="description" content="Comprehensive directory of healthcare providers, hospitals, and medical facilities." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Directory</h1>
            <p className="text-xl text-gray-600">Find healthcare providers, hospitals, and medical facilities</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors, hospitals, or specialties..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Specialties Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Medical Specialties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-3xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  <p className="text-[#5f4191] text-sm font-medium">{category.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Hospitals */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured Hospitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHospitals.map((hospital, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                  <p className="text-gray-600 mb-3">{hospital.location}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(hospital.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{hospital.rating}</span>
                    <span className="ml-2 text-sm text-gray-500">• {hospital.distance}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hospital.specialties.map((specialty, i) => (
                      <span key={i} className="px-2 py-1 bg-[#5f4191] bg-opacity-10 text-[#5f4191] text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <button className="w-full px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/doctors" className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#5f4191] hover:bg-[#5f4191] hover:bg-opacity-5 transition-colors">
                <div className="text-2xl mb-2">👨‍⚕️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Find Doctors</h3>
                <p className="text-sm text-gray-600">Search by specialty or location</p>
              </Link>
              <Link href="/hospitals" className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#5f4191] hover:bg-[#5f4191] hover:bg-opacity-5 transition-colors">
                <div className="text-2xl mb-2">🏥</div>
                <h3 className="font-semibold text-gray-900 mb-1">Hospitals</h3>
                <p className="text-sm text-gray-600">Browse hospital directory</p>
              </Link>
              <Link href="/clinics" className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#5f4191] hover:bg-[#5f4191] hover:bg-opacity-5 transition-colors">
                <div className="text-2xl mb-2">🏪</div>
                <h3 className="font-semibold text-gray-900 mb-1">Clinics</h3>
                <p className="text-sm text-gray-600">Find local clinics</p>
              </Link>
              <Link href="/emergency" className="text-center p-4 border border-gray-200 rounded-lg hover:border-[#5f4191] hover:bg-[#5f4191] hover:bg-opacity-5 transition-colors">
                <div className="text-2xl mb-2">🚨</div>
                <h3 className="font-semibold text-gray-900 mb-1">Emergency</h3>
                <p className="text-sm text-gray-600">Emergency services</p>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
