import Head from 'next/head';
import Link from 'next/link';

export default function HospitalsPage() {
  const hospitals = [
    {
      id: 1,
      name: "City General Hospital",
      location: "Downtown Medical District",
      rating: 4.8,
      distance: "2.3 miles",
      specialties: ["Emergency", "Surgery", "Cardiology", "Neurology"],
      image: "/images/hospital-1.jpg",
      description: "A leading medical center providing comprehensive healthcare services."
    },
    {
      id: 2,
      name: "Regional Medical Center",
      location: "Suburban Health Campus",
      rating: 4.6,
      distance: "5.7 miles",
      specialties: ["Pediatrics", "Orthopedics", "Oncology", "Maternity"],
      image: "/images/hospital-2.jpg",
      description: "Family-focused healthcare with specialized pediatric and maternity services."
    },
    {
      id: 3,
      name: "University Hospital",
      location: "Medical School Campus",
      rating: 4.9,
      distance: "8.2 miles",
      specialties: ["Research", "Teaching", "Specialized Care", "Transplant"],
      image: "/images/hospital-3.jpg",
      description: "Academic medical center with cutting-edge research and specialized treatments."
    },
    {
      id: 4,
      name: "Community Health Center",
      location: "Westside District",
      rating: 4.4,
      distance: "3.1 miles",
      specialties: ["Primary Care", "Mental Health", "Dental", "Community Outreach"],
      image: "/images/hospital-4.jpg",
      description: "Community-focused healthcare with comprehensive primary care services."
    }
  ];

  return (
    <>
      <Head>
        <title>Hospitals - Doctar</title>
        <meta name="description" content="Find hospitals and medical centers in your area with detailed information and ratings." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Hospitals & Medical Centers</h1>
            <p className="text-xl text-gray-600">Find the best hospitals in your area</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search hospitals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent">
                  <option>All Specialties</option>
                  <option>Emergency</option>
                  <option>Surgery</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent">
                  <option>Any Distance</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                  <option>Within 25 miles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospitals List */}
          <div className="space-y-6">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Hospital Image</span>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{hospital.name}</h3>
                        <p className="text-gray-600 mb-2">{hospital.location}</p>
                        <div className="flex items-center">
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
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{hospital.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-[#5f4191] bg-opacity-10 text-[#5f4191] text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-[#5f4191] text-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white transition-colors">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
