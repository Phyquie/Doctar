'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectRole, selectProfile } from '../store/slices/authSlice';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function DoctorDashboardPage() {
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const profile = useAppSelector(selectProfile);
  const currentLocation = useAppSelector(selectCurrentLocation);

  return (
    <ProtectedRoute requiredRole="doctor">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Dr. {user?.lastName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your practice and serve patients in {currentLocation?.city || 'your area'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
                  <p className="text-sm text-gray-600">View patient list</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                  <p className="text-sm text-gray-600">Manage appointments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Medical Records</h3>
                  <p className="text-sm text-gray-600">Patient records</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-600">Patient communication</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Appointments */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                  <button className="text-[#5f4191] hover:text-[#4d3374] font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">John Smith</h3>
                      <p className="text-sm text-gray-600">Follow-up consultation</p>
                      <p className="text-sm text-gray-500">2:00 PM - 2:30 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                      <p className="text-sm text-gray-600">Initial consultation</p>
                      <p className="text-sm text-gray-500">3:30 PM - 4:00 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Michael Brown</h3>
                      <p className="text-sm text-gray-600">Online consultation</p>
                      <p className="text-sm text-gray-500">4:30 PM - 5:00 PM</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                  <button className="text-[#5f4191] hover:text-[#4d3374] font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">JS</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">John Smith</h3>
                        <p className="text-sm text-gray-600">Last visit: Dec 10, 2024</p>
                      </div>
                    </div>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      View Profile
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">SJ</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                        <p className="text-sm text-gray-600">Last visit: Dec 8, 2024</p>
                      </div>
                    </div>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      View Profile
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">MB</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Michael Brown</h3>
                        <p className="text-sm text-gray-600">Last visit: Dec 5, 2024</p>
                      </div>
                    </div>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-[#5f4191] rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-xl">
                      {user?.firstName?.charAt(0) || 'D'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{profile?.specialization || 'Medical Professional'}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📧 {profile?.email || user?.email}</p>
                  <p>📱 {profile?.phone || 'Not provided'}</p>
                  <p>📍 {profile?.practiceAddress?.city || 'Not specified'}, {profile?.practiceAddress?.state || 'Not specified'}</p>
                  <p>💰 ₹{profile?.consultationFee || 'Not set'} consultation fee</p>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Practice Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Patients</span>
                    <span className="font-semibold text-gray-900">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Appointments Today</span>
                    <span className="font-semibold text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-gray-900">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900 mr-1">4.8</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Verification</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">License Verification</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medical Council</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Under Review
                    </span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 border border-[#5f4191] text-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white transition-colors">
                  Upload Documents
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                    Add New Patient
                  </button>
                  <button className="w-full text-left px-4 py-2 border border-[#5f4191] text-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white transition-colors">
                    Update Schedule
                  </button>
                  <button className="w-full text-left px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
