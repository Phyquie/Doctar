import Head from 'next/head';
import Link from 'next/link';

export default function ClinicsPage() {
  const clinics = [
    {
      id: 1,
      name: "Downtown Medical Clinic",
      location: "123 Main Street, Downtown",
      rating: 4.7,
      distance: "1.2 miles",
      specialties: ["Primary Care", "General Medicine", "Preventive Care"],
      hours: "Mon-Fri 8AM-6PM",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      name: "Family Health Center",
      location: "456 Oak Avenue, Suburbs",
      rating: 4.5,
      distance: "3.4 miles",
      specialties: ["Family Medicine", "Pediatrics", "Women's Health"],
      hours: "Mon-Fri 7AM-7PM, Sat 9AM-2PM",
      phone: "(555) 234-5678"
    },
    {
      id: 3,
      name: "Urgent Care Plus",
      location: "789 Pine Street, Midtown",
      rating: 4.3,
      distance: "2.8 miles",
      specialties: ["Urgent Care", "Minor Injuries", "Walk-in Appointments"],
      hours: "24/7 Emergency Care",
      phone: "(555) 345-6789"
    },
    {
      id: 4,
      name: "Wellness Clinic",
      location: "321 Elm Street, Eastside",
      rating: 4.8,
      distance: "4.1 miles",
      specialties: ["Wellness", "Preventive Care", "Health Screenings"],
      hours: "Mon-Fri 9AM-5PM",
      phone: "(555) 456-7890"
    }
  ];

  return (
    <>
      <Head>
        <title>Clinics - Doctar</title>
        <meta name="description" content="Find medical clinics and healthcare centers in your area with contact information and services." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Clinics</h1>
            <p className="text-xl text-gray-600">Find clinics and healthcare centers near you</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search clinics..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent">
                  <option>All Services</option>
                  <option>Primary Care</option>
                  <option>Urgent Care</option>
                  <option>Specialty Care</option>
                  <option>Preventive Care</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent">
                  <option>Any Distance</option>
                  <option>Within 2 miles</option>
                  <option>Within 5 miles</option>
                  <option>Within 10 miles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent">
                  <option>Any Time</option>
                  <option>Open Now</option>
                  <option>Weekends</option>
                  <option>24/7</option>
                </select>
              </div>
            </div>
          </div>

          {/* Clinics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{clinic.name}</h3>
                    <p className="text-gray-600 mb-2">{clinic.location}</p>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(clinic.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{clinic.rating}</span>
                      <span className="ml-2 text-sm text-gray-500">• {clinic.distance}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {clinic.specialties.map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-[#5f4191] bg-opacity-10 text-[#5f4191] text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {clinic.hours}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {clinic.phone}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                    Book Appointment
                  </button>
                  <button className="px-4 py-2 border border-[#5f4191] text-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white transition-colors">
                    Call
                  </button>
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
