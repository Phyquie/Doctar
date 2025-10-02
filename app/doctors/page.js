'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function DoctorsListPage() {
  const router = useRouter();
  const currentLocation = useAppSelector(selectCurrentLocation);
  
  // State management
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('experience'); // experience, rating, fee, name
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [initialLoad, setInitialLoad] = useState(true);

  // Specializations for filter
  const specializations = [
    { name: 'Cardiologist', value: 'cardiology' },
    { name: 'Dermatologist', value: 'dermatology' },
    { name: 'Endocrinologist', value: 'endocrinology' },
    { name: 'Gastroenterologist', value: 'gastroenterology' },
    { name: 'Gynecologist', value: 'gynecology' },
    { name: 'Neurologist', value: 'neurology' },
    { name: 'Oncologist', value: 'oncology' },
    { name: 'Ophthalmologist', value: 'ophthalmology' },
    { name: 'Orthopedist', value: 'orthopedics' },
    { name: 'Pediatrician', value: 'pediatric' },
    { name: 'Psychiatrist', value: 'psychiatry' },
    { name: 'Pulmonologist', value: 'pulmonology' },
    { name: 'Urologist', value: 'urology' },
    { name: 'General Physician', value: 'general_physician' },
    { name: 'Dentist', value: 'dentistry' },
    { name: 'Ayurveda', value: 'ayurveda' },
    { name: 'Homeopathy', value: 'homeopathy' },
    { name: 'Physiotherapist', value: 'physiotherapy' }
  ];

  // Fetch doctors with filters
  const fetchDoctors = useCallback(async (page = 1, filters = {}, isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setFilterLoading(true);
        }
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`/api/doctors?${params}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctors');
        }

        setDoctors(data.doctors || []);
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.message);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
          setInitialLoad(false);
        } else {
          setFilterLoading(false);
        }
      }
  }, [pagination.limit]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      const filters = {};
      if (selectedSpecialization) filters.specialization = selectedSpecialization;
      if (selectedLocation) filters.location = selectedLocation;
      if (searchTerm) filters.search = searchTerm;
      if (priceRange.min > 0) filters.minFee = priceRange.min;
      if (priceRange.max < 5000) filters.maxFee = priceRange.max;
      
      fetchDoctors(1, filters, true);
    }
  }, [initialLoad, fetchDoctors]);

  // Filter changes (after initial load)
  useEffect(() => {
    if (!initialLoad) {
      const filters = {};
      if (selectedSpecialization) filters.specialization = selectedSpecialization;
      if (selectedLocation) filters.location = selectedLocation;
      if (searchTerm) filters.search = searchTerm;
      if (priceRange.min > 0) filters.minFee = priceRange.min;
      if (priceRange.max < 5000) filters.maxFee = priceRange.max;
      
      fetchDoctors(1, filters, false);
    }
  }, [selectedSpecialization, selectedLocation, searchTerm, priceRange, fetchDoctors, initialLoad]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedSpecialization) filters.specialization = selectedSpecialization;
    if (selectedLocation) filters.location = selectedLocation;
    if (priceRange.min > 0) filters.minFee = priceRange.min;
    if (priceRange.max < 5000) filters.maxFee = priceRange.max;
    
    fetchDoctors(1, filters, false);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (selectedSpecialization) filters.specialization = selectedSpecialization;
    if (selectedLocation) filters.location = selectedLocation;
    if (priceRange.min > 0) filters.minFee = priceRange.min;
    if (priceRange.max < 5000) filters.maxFee = priceRange.max;
    
    fetchDoctors(newPage, filters, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setSelectedLocation('');
    setPriceRange({ min: 0, max: 5000 });
    setSortBy('experience');
    fetchDoctors(1, {}, false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Helper function to generate slug
  const generateSlug = (doctor) => {
    if (doctor.slug) return doctor.slug;
    
    const name = `${doctor.name.replace('Dr. ', '')}`.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    const specialization = doctor.specialization.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    return `${name}-${specialization}`;
  };

  // Helper function to generate public URL
  const generatePublicUrl = (doctor) => {
    if (doctor.publicUrl) return doctor.publicUrl;
    
    const location = doctor.location.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    return `/doctors/${location}/${generateSlug(doctor)}`;
  };

  // Doctor card component
  const DoctorCard = ({ doctor }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group relative"
      onClick={() => router.push(generatePublicUrl(doctor))}
    >
      {/* Header Section with gradient */}
      <div className="bg-gradient-to-r from-[#5f4191] to-[#7c5aa3] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Doctor Avatar */}
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={doctor.avatar}
                alt={doctor.name}
                fill
                className="rounded-full object-cover border-3 border-white shadow-lg"
              />
              {doctor.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Doctor Basic Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white truncate">
                {doctor.name}
              </h3>
              <p className="text-purple-100 text-sm font-medium">{doctor.specialization}</p>
            </div>
          </div>
          
          {/* Price Badge */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className=" text-lg font-bold text-[#5f4191]">₹{doctor.consultationFee}</div>
            <div className="text-[#5f4191] text-xs">Consultation</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(doctor.rating)}
            </div>
            <span className="text-gray-600 text-sm font-medium">
              {doctor.rating.toFixed(1)} ({doctor.reviewCount})
            </span>
          </div>
          <span className="bg-[#5f4191] bg-opacity-10 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {doctor.experience} Years Exp
          </span>
        </div>

        {/* Location Info */}
        <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
          <svg className="w-4 h-4 text-[#5f4191] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 text-sm font-medium truncate">{doctor.location}</span>
        </div>

        {/* Bio Preview */}
        {doctor.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {doctor.bio}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            className="flex-1 bg-[#5f4191] text-white py-3 rounded-xl hover:bg-[#4d3374] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              router.push(generatePublicUrl(doctor));
            }}
          >
            View Profile
          </button>
          <button 
            className="px-4 py-3 border-2 border-[#5f4191] text-[#5f4191] rounded-xl hover:bg-[#5f4191] hover:text-white transition-all duration-200 text-sm font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              // Add booking functionality here
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-[#5f4191] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );

  // List view component
  const DoctorListItem = ({ doctor }) => (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
      onClick={() => router.push(generatePublicUrl(doctor))}
    >
      <div className="p-6">
        <div className="flex items-center space-x-6">
          {/* Doctor Avatar */}
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image
              src={doctor.avatar}
              alt={doctor.name}
              fill
              className="rounded-2xl object-cover border-2 border-gray-100 group-hover:border-[#5f4191] transition-colors"
            />
            {doctor.isVerified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Doctor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5f4191] transition-colors">{doctor.name}</h3>
                  <span className="bg-[#5f4191] bg-opacity-10 text-[#5f4191] px-3 py-1 rounded-full text-xs font-semibold">
                    {doctor.experience} Years
                  </span>
                </div>
                
                <p className="text-[#5f4191] font-semibold text-base mb-3">{doctor.specialization}</p>
                
                {/* Rating and Location */}
                <div className="flex items-center space-x-6 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(doctor.rating)}
                    </div>
                    <span className="text-gray-600 text-sm font-medium">
                      {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#5f4191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700 text-sm font-medium">{doctor.location}</span>
                  </div>
                </div>

                {/* Bio Preview */}
                {doctor.bio && (
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {doctor.bio}
                  </p>
                )}
              </div>

              {/* Price and Action */}
              <div className="text-right flex-shrink-0">
                <div className="bg-gradient-to-r from-[#5f4191] to-[#7c5aa3] text-white p-4 rounded-2xl mb-4 text-center">
                  <div className="text-2xl font-bold">₹{doctor.consultationFee}</div>
                  <div className="text-purple-100 text-xs">Consultation Fee</div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button 
                    className="px-6 py-3 bg-[#5f4191] text-white rounded-xl hover:bg-[#4d3374] transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(generatePublicUrl(doctor));
                    }}
                  >
                    View Profile
                  </button>
                  <button 
                    className="px-6 py-2 border-2 border-[#5f4191] text-[#5f4191] rounded-xl hover:bg-[#5f4191] hover:text-white transition-all duration-200 text-sm font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add booking functionality here
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Search and Filters Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Doctor Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="animate-pulse flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 19c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Doctors</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
            <p className="text-xl text-gray-600 mb-6">
              Connect with qualified healthcare professionals in your area
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verified Doctors</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors by name, specialization, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-6 bg-[#5f4191] text-white rounded-r-lg hover:bg-[#4d3374] transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#5f4191] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#5f4191] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500">
              {pagination.total} doctors found
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec) => (
                      <option key={spec.value} value={spec.value}>{spec.name}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 5000})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                    />
                  </div>
                    </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                  >
                    <option value="experience">Experience</option>
                    <option value="rating">Rating</option>
                    <option value="fee">Consultation Fee</option>
                    <option value="name">Name</option>
                  </select>
                </div>
                    </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
                    )}
                  </div>

        {/* Doctors List */}
        {doctors.length > 0 ? (
          <>
            <div className={`relative ${viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 px-2" 
              : "space-y-6 mb-8"
            }`}>
              {filterLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5f4191]"></div>
                    <span className="text-gray-600">Updating results...</span>
                  </div>
                </div>
              )}
              {doctors.map((doctor) => (
                viewMode === 'grid' ? (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ) : (
                  <DoctorListItem key={doctor.id} doctor={doctor} />
                )
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        pagination.page === page
                          ? 'bg-[#5f4191] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Doctors */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Doctors Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSpecialization || selectedLocation 
                ? "No doctors match your search criteria. Try adjusting your filters."
                : "There are no doctors registered in the system yet."
              }
            </p>
            {(searchTerm || selectedSpecialization || selectedLocation) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
