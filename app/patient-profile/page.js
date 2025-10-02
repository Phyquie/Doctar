'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import ImageUpload from '../components/ImageUpload';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectUser, selectRole, selectProfile, updateProfile } from '../store/slices/authSlice';
import { selectCurrentLocation } from '../store/slices/locationSlice';
import { useState, useEffect } from 'react';

export default function PatientProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const role = useAppSelector(selectRole);
  const profile = useAppSelector(selectProfile);
  const currentLocation = useAppSelector(selectCurrentLocation);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({
    firstName: profile?.firstName || user?.firstName || '',
    lastName: profile?.lastName || user?.lastName || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    dateOfBirth: profile?.dateOfBirth || '',
    gender: profile?.gender || '',
    location: profile?.location || currentLocation?.city || '',
    language: profile?.language || 'English',
    emergencyContact: profile?.emergencyContact || '',
    address: profile?.address || '',
    bloodGroup: profile?.bloodGroup || '',
    allergies: profile?.allergies || '',
    medicalHistory: profile?.medicalHistory || '',
    avatar: profile?.avatar || user?.avatar || '/icons/user-placeholder.png',
    avatarPublicId: profile?.avatarPublicId || ''
  });

  // Update editData when profile changes (e.g., after login or profile update)
  useEffect(() => {
    setEditData({
      firstName: profile?.firstName || user?.firstName || '',
      lastName: profile?.lastName || user?.lastName || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || '',
      location: profile?.location || currentLocation?.city || '',
      language: profile?.language || 'English',
      emergencyContact: profile?.emergencyContact || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies || '',
      medicalHistory: profile?.medicalHistory || '',
      avatar: profile?.avatar || user?.avatar || '/icons/user-placeholder.png',
      avatarPublicId: profile?.avatarPublicId || ''
    });
  }, [profile, user, currentLocation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (imageUrl, publicId) => {
    setEditData(prev => ({
      ...prev,
      avatar: imageUrl,
      avatarPublicId: publicId
    }));
    setSuccess('Image uploaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Get token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }
      
      console.log('Updating patient profile with avatar:', editData.avatar);
      
      const response = await fetch('/api/auth/update-patient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          updateData: editData
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      // Update Redux store with new data
      dispatch(updateProfile({
        user: result.user,
        profile: result.profile
      }));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: profile?.firstName || user?.firstName || '',
      lastName: profile?.lastName || user?.lastName || '',
      email: user?.email || '',
      phone: profile?.phone || '',
      dateOfBirth: profile?.dateOfBirth || '',
      gender: profile?.gender || '',
      location: profile?.location || currentLocation?.city || '',
      language: profile?.language || 'English',
      emergencyContact: profile?.emergencyContact || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies || '',
      medicalHistory: profile?.medicalHistory || '',
      avatar: profile?.avatar || user?.avatar || '/icons/user-placeholder.png',
      avatarPublicId: profile?.avatarPublicId || ''
    });
    setIsEditing(false);
  };

  return (
    <ProtectedRoute requiredRole="patient">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="mr-4">
                  <ImageUpload
                    currentImage={editData.avatar}
                    onImageChange={handleImageChange}
                    size="medium"
                    shape="circle"
                    showUploadButton={isEditing}
                    folder="doctar/patients"
                    transformation="profile"
                    disabled={isUploadingImage}
                    alt="Patient Profile"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-sm text-gray-600">Patient Profile</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.firstName || user?.firstName || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.lastName || user?.lastName || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900 py-2">{user?.email || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.phone || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2 capitalize">{profile?.gender || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.location || currentLocation?.city || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                {isEditing ? (
                  <select
                    name="language"
                    value={editData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profile?.language || 'English'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={editData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.emergencyContact || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                {isEditing ? (
                  <select
                    name="bloodGroup"
                    value={editData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">{profile?.bloodGroup || 'Not provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="allergies"
                    value={editData.allergies}
                    onChange={handleInputChange}
                    placeholder="List any allergies"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.allergies || 'None reported'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                {isEditing ? (
                  <textarea
                    name="medicalHistory"
                    value={editData.medicalHistory}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe any medical conditions or history"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{profile?.medicalHistory || 'No medical history recorded'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
