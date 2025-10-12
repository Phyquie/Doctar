'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useAppSelector } from '../../store/hooks';
import { selectUser, selectRole } from '../../store/slices/authSlice';
import BookingsList from '../../components/BookingsList';

export default function PatientBookingsPage() {
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);

  return (
    <ProtectedRoute requiredRole="patient">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-600 mt-1">View your upcoming and past appointments</p>
          </div>
          <BookingsList patientId={user?._id} title="Your Appointments" />
        </div>
      </div>
    </ProtectedRoute>
  );
}
