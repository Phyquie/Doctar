'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useSelector } from 'react-redux';

export default function DoctorEditPage() {
  const router = useRouter();
  
  // Redux selectors
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    experience: 0,
    qualification: '',
    bio: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: 0,
    phone: '',
    email: '',
    location: '',
    language: 'English',
    coordinates: {
      latitude: '',
      longitude: ''
    },
    awards: [],
    services: [],
    pastExperiences: [],
    weeklyAvailability: {
      monday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      tuesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      wednesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      thursday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      friday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      saturday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      sunday: { available: false, timeSlots: [] }
    }
  });

  // File upload states
  const [documentFiles, setDocumentFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [existingGallery, setExistingGallery] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!isAuthenticated || role !== 'doctor' || !user?.id) {
        setError('Please log in as a doctor to edit your profile.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/${user.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Doctor not found');
        }

        setDoctor(data.doctor);
        
        // Set existing gallery images
        if (data.doctor.gallery && data.doctor.gallery.length > 0) {
          setExistingGallery(data.doctor.gallery);
        }
        
        // Populate form data
        setFormData({
          firstName: data.doctor.firstName || '',
          lastName: data.doctor.lastName || '',
          specialization: data.doctor.specialization || '',
          experience: data.doctor.experience || 0,
          qualification: data.doctor.qualification || '',
          bio: data.doctor.bio || '',
          clinicName: data.doctor.clinicName || '',
          clinicAddress: data.doctor.clinicAddress || '',
          consultationFee: data.doctor.consultationFee || 0,
          phone: data.doctor.phone || '',
          email: data.doctor.email || '',
          location: data.doctor.location || '',
          language: data.doctor.language || 'English',
          coordinates: {
            latitude: data.doctor.coordinates?.latitude || '',
            longitude: data.doctor.coordinates?.longitude || ''
          },
          awards: data.doctor.awards || [],
          services: data.doctor.services || [],
          pastExperiences: data.doctor.pastExperiences || [],
          avatar: data.doctor.avatar || '',
          avatarPublicId: data.doctor.avatarPublicId || '',
          weeklyAvailability: data.doctor.weeklyAvailability || {
            monday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            tuesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            wednesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            thursday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            friday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            saturday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
            sunday: { available: false, timeSlots: [] }
          }
        });
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [isAuthenticated, role, user?.id]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleNestedInputChange = (parentKey, childKey, value) => {
    setFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  // Array management functions
  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: '', year: new Date().getFullYear(), organization: '', description: '' }]
    }));
  };

  const updateAward = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) => 
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', price: 0, duration: 30 }]
    }));
  };

  const updateService = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addPastExperience = () => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: [...prev.pastExperiences, { 
        position: '', 
        organization: '', 
        startDate: '', 
        endDate: '', 
        current: false, 
        description: '' 
      }]
    }));
  };

  const updatePastExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: prev.pastExperiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removePastExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: prev.pastExperiences.filter((_, i) => i !== index)
    }));
  };

  // File upload handlers
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', `doctar/doctors/${user.id}/avatar`);
      formData.append('transformation', 'profile');

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload avatar');
      }

      // Update form data with new avatar
      setFormData(prev => ({
        ...prev,
        avatar: result.imageUrl,
        avatarPublicId: result.publicId
      }));

    } catch (error) {
      console.error('Avatar upload error:', error);
      setError(`Failed to upload avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', `doctar/doctors/${user.id}/gallery`);
        formData.append('transformation', 'gallery');

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to upload image');
        }

        return {
          url: result.imageUrl,
          publicId: result.publicId,
          caption: file.name.split('.')[0] // Use filename as caption
          // Don't include _id for new images, let MongoDB generate it
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setExistingGallery(prev => [...prev, ...uploadedImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setError(`Failed to upload images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };


  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(prev => [...prev, ...files]);
  };

  const removeDocumentFile = (index) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle existing gallery images
  const removeExistingImage = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingGallery(prev => prev.filter(img => img._id !== imageId));
  };

  const restoreExistingImage = (imageId) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
    // Find the image in the original doctor data and restore it
    if (doctor?.gallery) {
      const imageToRestore = doctor.gallery.find(img => img._id === imageId);
      if (imageToRestore) {
        setExistingGallery(prev => [...prev, imageToRestore]);
      }
    }
  };

  // Handle new gallery images (without _id)
  const removeNewImage = (index) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess(false);

      // Prepare update data with gallery information
      const updateData = {
        ...formData,
        gallery: existingGallery,
        imagesToDelete: imagesToDelete
      };

      const response = await fetch(`/api/doctors/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/doctor-profile');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#5f4191] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error || 'The doctor profile could not be loaded.'}</p>
          <Link
            href="/doctor-profile"
            className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Profile - {doctor?.name || 'Doctor'} | Doctar</title>
        <meta name="description" content="Edit your doctor profile information" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-[#5f4191]">Home</Link></li>
                <li>/</li>
                <li><Link href="/doctor-profile" className="hover:text-[#5f4191]">My Profile</Link></li>
                <li>/</li>
                <li><span className="text-gray-900">Edit Profile</span></li>
              </ol>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 mt-2">Update your professional information</p>
              </div>
              <Link
                href="/doctor-profile"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">Profile updated successfully! Redirecting...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Current avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : doctor?.avatar ? (
                    <img 
                      src={doctor.avatar} 
                      alt="Current avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#5f4191] hover:bg-[#4d3374]'
                    } text-white`}
                  >
                    {uploading ? 'Uploading...' : (formData.avatar ? 'Change Picture' : 'Upload Picture')}
                  </label>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.latitude}
                    onChange={(e) => handleNestedInputChange('coordinates', 'latitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    placeholder="e.g., 23.7957"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.coordinates.longitude}
                    onChange={(e) => handleNestedInputChange('coordinates', 'longitude', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    placeholder="e.g., 86.4304"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    placeholder="Tell us about yourself, your experience, and what makes you unique..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                    <input
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Address</label>
                  <textarea
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    placeholder="Enter your clinic's complete address..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Awards & Recognition</h2>
                <button
                  type="button"
                  onClick={addAward}
                  className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
                >
                  Add Award
                </button>
              </div>
              <div className="space-y-4">
                {formData.awards.map((award, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Award Title</label>
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => updateAward(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="e.g., Best Doctor Award"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <input
                          type="number"
                          value={award.year}
                          onChange={(e) => updateAward(index, 'year', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                        <input
                          type="text"
                          value={award.organization}
                          onChange={(e) => updateAward(index, 'organization', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="e.g., Medical Association"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeAward(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        value={award.description}
                        onChange={(e) => updateAward(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                        rows="2"
                        placeholder="Brief description of the award..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Services Offered</h2>
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
                >
                  Add Service
                </button>
              </div>
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="e.g., General Consultation"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          value={service.duration}
                          onChange={(e) => updateService(index, 'duration', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="30"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                        rows="2"
                        placeholder="Brief description of the service..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Experiences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Past Experiences</h2>
                <button
                  type="button"
                  onClick={addPastExperience}
                  className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
                >
                  Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {formData.pastExperiences.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updatePastExperience(index, 'position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="e.g., Senior Consultant"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => updatePastExperience(index, 'organization', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          placeholder="e.g., Apollo Hospital"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updatePastExperience(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updatePastExperience(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                          disabled={exp.current}
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updatePastExperience(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Currently working here</label>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removePastExperience(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updatePastExperience(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                        rows="2"
                        placeholder="Brief description of your role and responsibilities..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Schedule</h2>
              <div className="space-y-4">
                {Object.entries(formData.weeklyAvailability).map(([day, schedule]) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 capitalize">{day}</h3>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={schedule.available}
                          onChange={(e) => {
                            const newSchedule = { ...schedule, available: e.target.checked };
                            setFormData(prev => ({
                              ...prev,
                              weeklyAvailability: {
                                ...prev.weeklyAvailability,
                                [day]: newSchedule
                              }
                            }));
                          }}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Available</label>
                      </div>
                    </div>
                    {schedule.available && (
                      <div className="space-y-2">
                        {schedule.timeSlots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center space-x-2">
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => {
                                const newSlots = [...schedule.timeSlots];
                                newSlots[slotIndex] = { ...slot, startTime: e.target.value };
                                setFormData(prev => ({
                                  ...prev,
                                  weeklyAvailability: {
                                    ...prev.weeklyAvailability,
                                    [day]: { ...schedule, timeSlots: newSlots }
                                  }
                                }));
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => {
                                const newSlots = [...schedule.timeSlots];
                                newSlots[slotIndex] = { ...slot, endTime: e.target.value };
                                setFormData(prev => ({
                                  ...prev,
                                  weeklyAvailability: {
                                    ...prev.weeklyAvailability,
                                    [day]: { ...schedule, timeSlots: newSlots }
                                  }
                                }));
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                            />
                            {schedule.timeSlots.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newSlots = schedule.timeSlots.filter((_, i) => i !== slotIndex);
                                  setFormData(prev => ({
                                    ...prev,
                                    weeklyAvailability: {
                                      ...prev.weeklyAvailability,
                                      [day]: { ...schedule, timeSlots: newSlots }
                                    }
                                  }));
                                }}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newSlots = [...schedule.timeSlots, { startTime: '09:00 AM', endTime: '05:00 PM' }];
                            setFormData(prev => ({
                              ...prev,
                              weeklyAvailability: {
                                ...prev.weeklyAvailability,
                                [day]: { ...schedule, timeSlots: newSlots }
                              }
                            }));
                          }}
                          className="px-3 py-1 bg-[#5f4191] text-white rounded text-sm hover:bg-[#4d3374] transition-colors"
                        >
                          Add Time Slot
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Clinic Gallery</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#5f4191] hover:bg-[#4d3374]'
                    } text-white`}
                  >
                    {uploading ? 'Uploading Images...' : 'Upload New Images'}
                  </label>
                  <p className="text-sm text-gray-500 mt-1">Upload multiple images of your clinic (JPG, PNG up to 5MB each)</p>
                </div>

                {/* Existing Gallery Images */}
                {existingGallery.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Current Gallery Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingGallery.map((image, index) => (
                        <div key={image._id || `new_${index}`} className="relative group">
                          <img
                            src={image.url}
                            alt={image.caption || `Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => image._id ? removeExistingImage(image._id) : removeNewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            ×
                          </button>
                          {image.caption && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{image.caption}</p>
                          )}
                          {!image._id && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              New
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Images to be deleted */}
                {imagesToDelete.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Images to be Deleted</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagesToDelete.map((imageId) => {
                        const image = doctor?.gallery?.find(img => img._id === imageId);
                        if (!image) return null;
                        return (
                          <div key={imageId} className="relative group opacity-50">
                            <img
                              src={image.url}
                              alt={image.caption || 'Image to delete'}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => restoreExistingImage(imageId)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-green-600 transition-colors"
                            >
                              ↶
                            </button>
                            <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                              <span className="text-red-600 font-semibold text-sm">To Delete</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Documents</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={handleDocumentChange}
                    className="hidden"
                    id="document-upload"
                  />
                  <label
                    htmlFor="document-upload"
                    className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors cursor-pointer"
                  >
                    Upload Documents
                  </label>
                  <p className="text-sm text-gray-500 mt-1">Upload your professional documents (licenses, degrees, certificates)</p>
                </div>
                {documentFiles.length > 0 && (
                  <div className="space-y-2">
                    {documentFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocumentFile(index)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/doctor-profile"
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
