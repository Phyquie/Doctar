'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectRole, selectProfile } from '../store/slices/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const profile = useAppSelector(selectProfile);

  useEffect(() => {
    if (role === 'patient') {
      router.push('/patient-profile');
    } else if (role === 'doctor') {
      router.push('/doctor-profile');
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#5f4191] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Dashboard</h2>
        <p className="text-gray-600">Please wait while we redirect you to your personalized dashboard...</p>
      </div>
    </div>
  );
}
