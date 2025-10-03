'use client';

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import LocationPicker from './LocationPicker';
import { GeocodingService } from '../services/geocoding';

const Specialization = [
  { name: 'Pediatrician', value: 'pediatric', description: "Children's health specialists" },
  { name: 'Psychiatrist', value: 'psychiatry', description: 'Mental health specialists' },
  { name: 'Pulmonologist', value: 'pulmonology', description: 'Lung and respiratory specialists' },
  { name: 'Urologist', value: 'urology', description: 'Urinary system specialists' },
  { name: 'General Physician', value: 'general_physician', description: 'Primary healthcare specialists' },
  { name: 'Dentist', value: 'dentistry', description: 'Oral and dental health specialists' },
  { name: 'Cardiologist', value: 'cardiology', description: 'Heart and cardiovascular system specialists' },
  { name: 'Dermatologist', value: 'dermatology', description: 'Skin, hair, and nail specialists' },
  { name: 'Endocrinologist', value: 'endocrinology', description: 'Hormone and diabetes specialists' },
  { name: 'Gastroenterologist', value: 'gastroenterology', description: 'Digestive system specialists' },
  { name: 'Gynecologist', value: 'gynecology', description: "Women's health specialists" },
  { name: 'Neurologist', value: 'neurology', description: 'Brain and nervous system specialists' },
  { name: 'Oncologist', value: 'oncology', description: 'Cancer treatment specialists' },
  { name: 'Ophthalmologist', value: 'ophthalmology', description: 'Eye and vision specialists' },
  { name: 'Orthopedist', value: 'orthopedics', description: 'Bone and joint specialists' },
  { name: 'Ayurveda', value: 'ayurveda', description: 'Traditional Indian medicine specialists' },
  { name: 'Homeopathy', value: 'homeopathy', description: 'Homeopathic medicine specialists' },
  { name: 'Physiotherapist', value: 'physiotherapy', description: 'Physical therapy and rehabilitation specialists' }
];

const AddDoctorModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    specialization: '',
    qualification: '',
    experience: '',
    awards: [],
    pastExperiences: [],
    bio: '',
    licenseNumber: '',
    
    // Practice Information
    clinicName: '',
    clinicAddress: '',
    clinicCoordinates: {
      latitude: '',
      longitude: ''
    },
    consultationFee: '',
    services: [],
    location: '',
    language: '',
    
    // Availability
    weeklyAvailability: {
      monday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      tuesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      wednesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      thursday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      friday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
      saturday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '02:00 PM' }] },
      sunday: { available: false, timeSlots: [] }
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [clinicImages, setClinicImages] = useState([]);

  // Time slot options
  const timeOptions = [];
  for (let hour = 1; hour <= 12; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00 AM`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30 AM`);
  }
  for (let hour = 1; hour <= 12; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00 PM`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30 PM`);
  }

  // Helper functions for managing array fields
  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: '', year: new Date().getFullYear(), organization: '', description: '' }]
    }));
  };

  const removeAward = (index) => {
    setFormData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
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

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', description: '', price: '', duration: '' }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
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

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: [...prev.pastExperiences, { position: '', organization: '', startDate: '', endDate: '', current: false, description: '' }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: prev.pastExperiences.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pastExperiences: prev.pastExperiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateAvailability = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: {
          ...prev.weeklyAvailability[day],
          [field]: value
        }
      }
    }));
  };

  const addTimeSlot = (day) => {
    setFormData(prev => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: {
          ...prev.weeklyAvailability[day],
          timeSlots: [...prev.weeklyAvailability[day].timeSlots, { startTime: '09:00 AM', endTime: '05:00 PM' }]
        }
      }
    }));
  };

  const removeTimeSlot = (day, index) => {
    setFormData(prev => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: {
          ...prev.weeklyAvailability[day],
          timeSlots: prev.weeklyAvailability[day].timeSlots.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      weeklyAvailability: {
        ...prev.weeklyAvailability,
        [day]: {
          ...prev.weeklyAvailability[day],
          timeSlots: prev.weeklyAvailability[day].timeSlots.map((slot, i) => 
            i === index ? { ...slot, [field]: value } : slot
          )
        }
      }
    }));
  };

    const setCoordinatesFromLocation = (latitude, longitude, locationName = '') => {
    setFormData(prev => ({
      ...prev,
      clinicCoordinates: {
        latitude: latitude,
        longitude: longitude
      },
      location: locationName || prev.location,
      clinicAddress: locationName || prev.clinicAddress
    }));
  };

  const handleLocationSelect = (coordinates) => {
    setFormData(prev => ({
      ...prev,
      clinicCoordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        city: coordinates.city,
        address: coordinates.address,
        name: coordinates.name
      },
      location: coordinates.city || coordinates.address || prev.location,
      clinicAddress: coordinates.address || prev.clinicAddress
    }));
    setShowLocationPicker(false);
  };

  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    try {
      // Get current position
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Try to get address using reverse geocoding
      try {
        const locationData = await GeocodingService.reverseGeocode(latitude, longitude);
        
        if (locationData && locationData.city) {
          const address = locationData.address || `${locationData.city}, ${locationData.state || ''}`.trim().replace(/,$/, '');
          
          setCoordinatesFromLocation(latitude, longitude, address, locationData.city);
        } else {
          // Fallback with coordinates if no city found
          setCoordinatesFromLocation(latitude, longitude, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'Current Location');
        }
      } catch (geocodingError) {
        console.error('Reverse geocoding failed:', geocodingError);
        
        // Use coordinates without address details
        setCoordinatesFromLocation(latitude, longitude, `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`, 'Location Found');
      }
      
    } catch (error) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get your current location.';
      
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your GPS settings.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleImageUpload = (images) => {
    // Convert uploaded images to URLs if they're File objects
    const imageUrls = images.map(image => {
      if (typeof image === 'string') {
        return image; // Already a URL
      } else if (image instanceof File) {
        return URL.createObjectURL(image); // Convert File to URL for preview
      }
      return image;
    });
    
    setClinicImages(imageUrls);
    
    // Update form data with actual image URLs/files for submission
    setFormData(prev => ({
      ...prev,
      clinicImages: images // Keep original images for form submission
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;
        
      case 2:
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        else if (isNaN(formData.experience) || formData.experience < 0) newErrors.experience = 'Experience must be a valid number';
        break;
        
      case 3:
        if (!formData.clinicName.trim()) newErrors.clinicName = 'Clinic name is required';
        if (!formData.clinicAddress.trim()) newErrors.clinicAddress = 'Clinic address is required';
        if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';
        else if (isNaN(formData.consultationFee) || formData.consultationFee < 0) newErrors.consultationFee = 'Consultation fee must be a valid number';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    
    try {
      // Convert numeric fields
      const doctorData = {
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee)
      };
      
      await onSubmit(doctorData);
      handleClose();
    } catch (error) {
      console.error('Error adding doctor:', error);
      // Handle error - could set a general error state here
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      // Basic Information
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      dateOfBirth: '',
      gender: '',
      
      // Professional Information
      specialization: '',
      qualification: '',
      experience: '',
      awards: [],
      pastExperiences: [],
      bio: '',
      licenseNumber: '',
      
      // Practice Information
      clinicName: '',
      clinicAddress: '',
      clinicCoordinates: {
        latitude: '',
        longitude: ''
      },
      consultationFee: '',
      services: [],
      location: '',
      language: 'English',
      
      // Availability
      weeklyAvailability: {
        monday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
        tuesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
        wednesday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
        thursday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
        friday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '05:00 PM' }] },
        saturday: { available: true, timeSlots: [{ startTime: '09:00 AM', endTime: '02:00 PM' }] },
        sunday: { available: false, timeSlots: [] }
      }
    });
    setErrors({});
    setCurrentStep(1);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information & Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select your specialization</option>
                  {Specialization.map((spec) => (
                    <option key={spec.value} value={spec.value}>
                      {spec.name}
                    </option>
                  ))}
                </select>
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.qualification ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., MBBS, MD"
                />
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Years of experience"
                  min="0"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] border-gray-300"
                  placeholder="Medical license number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] border-gray-300"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>

            {/* Awards Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Awards & Recognition</label>
                <button
                  type="button"
                  onClick={addAward}
                  className="px-3 py-1 bg-[#5f4191] text-white rounded text-sm hover:bg-[#4d3374]"
                >
                  Add Award
                </button>
              </div>
              {formData.awards.map((award, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Award {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Award Title"
                      value={award.title}
                      onChange={(e) => updateAward(index, 'title', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="number"
                      placeholder="Year"
                      value={award.year}
                      onChange={(e) => updateAward(index, 'year', parseInt(e.target.value))}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="text"
                      placeholder="Organization"
                      value={award.organization}
                      onChange={(e) => updateAward(index, 'organization', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191] md:col-span-2"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={award.description}
                      onChange={(e) => updateAward(index, 'description', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191] md:col-span-2"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Past Experiences Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Past Experiences</label>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1 bg-[#5f4191] text-white rounded text-sm hover:bg-[#4d3374]"
                >
                  Add Experience
                </button>
              </div>
              {formData.pastExperiences.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="text"
                      placeholder="Organization"
                      value={exp.organization}
                      onChange={(e) => updateExperience(index, 'organization', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                      disabled={exp.current}
                    />
                    <label className="flex items-center md:col-span-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      Currently working here
                    </label>
                    <textarea
                      placeholder="Description (optional)"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191] md:col-span-2"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name *</label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.clinicName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter clinic name"
              />
              {errors.clinicName && <p className="text-red-500 text-sm mt-1">{errors.clinicName}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Address *</label>
              <div className="flex gap-2">
                <textarea
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.clinicAddress ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter complete clinic address"
                  rows="3"
                />
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocationLoading}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                    title="Get current location automatically"
                  >
                    {isLocationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden sm:inline">Getting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="hidden sm:inline">Current</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLocationPicker(true)}
                    className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] flex items-center gap-1"
                    title="Pick location on map"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>
              {errors.clinicAddress && <p className="text-red-500 text-sm mt-1">{errors.clinicAddress}</p>}
              
              {/* Location Status Display */}
              {formData.clinicCoordinates.latitude ? (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 mb-1">📍 Location Selected</p>
                      <p className="text-sm text-green-700">
                        <strong>Coordinates:</strong> {formData.clinicCoordinates.latitude.toFixed(6)}, {formData.clinicCoordinates.longitude.toFixed(6)}
                      </p>
                      {formData.clinicCoordinates.city && (
                        <p className="text-sm text-green-700">
                          <strong>City:</strong> {formData.clinicCoordinates.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">💡 Use the buttons above to set location coordinates</p>
                </div>
              )}
              
              {/* Editable Coordinates */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    value={formData.clinicCoordinates.latitude || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      clinicCoordinates: {
                        ...prev.clinicCoordinates,
                        latitude: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] border-gray-300"
                    placeholder="e.g., 28.6139"
                    step="any"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    value={formData.clinicCoordinates.longitude || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      clinicCoordinates: {
                        ...prev.clinicCoordinates,
                        longitude: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] border-gray-300"
                    placeholder="e.g., 77.2090"
                    step="any"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) *</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.consultationFee ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter consultation fee"
                  min="0"
                />
                {errors.consultationFee && <p className="text-red-500 text-sm mt-1">{errors.consultationFee}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="City/Location"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] border-gray-300"
                placeholder="Languages spoken"
              />
            </div>



            {/* Clinic Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Clinic Images</label>
              <ImageUpload
                onImagesChange={handleImageUpload}
                maxImages={5}
                accept="image/*"
                className="w-full"
              />
              {clinicImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">{clinicImages.length} image(s) selected</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {clinicImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Clinic ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Services Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Services Offered</label>
                <button
                  type="button"
                  onClick={addService}
                  className="px-3 py-1 bg-[#5f4191] text-white rounded text-sm hover:bg-[#4d3374]"
                >
                  Add Service
                </button>
              </div>
              {formData.services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Service {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191] md:col-span-2"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={service.price}
                      onChange={(e) => updateService(index, 'price', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={service.duration}
                      onChange={(e) => updateService(index, 'duration', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                    />
                    <textarea
                      placeholder="Description (optional)"
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191] md:col-span-2"
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Availability</h2>
            
            {/* Weekly Availability */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Your Weekly Schedule</h3>
              {Object.keys(formData.weeklyAvailability).map((day) => (
                <div key={day} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">{day}</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.weeklyAvailability[day].available}
                        onChange={(e) => updateAvailability(day, 'available', e.target.checked)}
                        className="mr-2"
                      />
                      Available
                    </label>
                  </div>
                  
                  {formData.weeklyAvailability[day].available ? (
                    <div className="space-y-2">
                      {formData.weeklyAvailability[day].timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-2">
                          <select
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(day, slotIndex, 'startTime', e.target.value)}
                            className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          <span>to</span>
                          <select
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(day, slotIndex, 'endTime', e.target.value)}
                            className="px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f4191]"
                          >
                            {timeOptions.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          {formData.weeklyAvailability[day].timeSlots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(day, slotIndex)}
                              className="text-red-500 hover:text-red-700 px-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTimeSlot(day)}
                        className="text-[#5f4191] hover:text-[#4d3374] text-sm mt-2"
                      >
                        + Add Time Slot
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Not Available</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div>
            <h3 className="text-2xl font-medium text-gray-900">Add New Doctor</h3>
            <p className="text-gray-600 text-sm mt-1">Step {currentStep} of 4</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-[#5f4191] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-[#5f4191]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Professional</span>
            <span>Practice</span>
            <span>Availability</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || loading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="px-6 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding Doctor...
              </>
            ) : (
              currentStep === 4 ? 'Add Doctor' : 'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;