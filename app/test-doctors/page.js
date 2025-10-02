'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TestDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/test-doctors');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctors');
        }

        setDoctors(data.doctors || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestDoctors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Loading Doctors...</h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Error Loading Doctors</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <p className="text-gray-600 mb-4">This might mean:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
            <li>No doctors are registered in the database yet</li>
            <li>Database connection issue</li>
            <li>The doctor registration process hasn't been completed</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">To test with real data:</h3>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Go to <Link href="/auth/doctor-onboarding" className="underline">/auth/doctor-onboarding</Link></li>
              <li>Complete the doctor registration process</li>
              <li>Come back to this page to see registered doctors</li>
              <li>Click on any doctor to view their profile</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Doctor Profiles</h1>
        
        {doctors.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">No Doctors Found</h2>
            <p className="text-yellow-700 mb-4">
              There are no doctors registered in the database yet. To test the doctor profile page:
            </p>
            <ol className="list-decimal list-inside text-yellow-700 space-y-2 mb-4">
              <li>Go to the doctor registration page</li>
              <li>Complete the registration process</li>
              <li>Come back here to access the profile</li>
            </ol>
            <Link 
              href="/auth/doctor-onboarding"
              className="inline-block px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Register as Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Found {doctors.length} doctor(s) in the database. Click on any doctor to view their profile:
            </p>
            
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialization}</p>
                    <p className="text-gray-500 text-sm">{doctor.email}</p>
                    <p className="text-gray-400 text-xs mt-1">ID: {doctor.id}</p>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href={doctor.profileUrl}
                      className="block px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors text-center"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(doctor.profileUrl);
                        alert('Profile URL copied to clipboard!');
                      }}
                      className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-900 mb-2">✅ How to test:</h3>
              <ol className="list-decimal list-inside text-green-800 space-y-1">
                <li>Click "View Profile" on any doctor above</li>
                <li>Or copy the URL and paste it in a new tab</li>
                <li>Test all three tabs: About, Review, Contact</li>
                <li>Check that data is loading from the database</li>
              </ol>
            </div>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Quick Links:</h3>
          <div className="space-x-4">
            <Link href="/doctors" className="text-[#5f4191] hover:underline">
              All Doctors (Public View)
            </Link>
            <Link href="/auth/doctor-onboarding" className="text-[#5f4191] hover:underline">
              Register New Doctor
            </Link>
            <Link href="/doctor-dashboard" className="text-[#5f4191] hover:underline">
              Doctor Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

