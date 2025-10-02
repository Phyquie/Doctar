'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import FAQSection from '../components/FAQSection';
import WeeklySchedule from '../components/WeeklySchedule';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

export default function ProtectedDoctorProfilePage() {
  const router = useRouter();
  
  // Redux selectors
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [availability, setAvailability] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState({ km: 0, time: 0 });
  const [clinicImages, setClinicImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Calculate distance between user location and doctor's location
  const calculateDistance = useCallback((userLat, userLng) => {
    if (!doctor?.latitude || !doctor?.longitude) return;
    
    const R = 6371;
    const dLat = (doctor.latitude - userLat) * Math.PI / 180;
    const dLng = (doctor.longitude - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(doctor.latitude * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    
    const timeMinutes = Math.round((distanceKm / 30) * 60);
    
    setDistance({
      km: Math.round(distanceKm * 10) / 10,
      time: timeMinutes
    });
  }, [doctor?.latitude, doctor?.longitude]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          calculateDistance(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ latitude: 23.7957, longitude: 86.4304 });
          calculateDistance(23.7957, 86.4304);
        }
      );
    } else {
      setUserLocation({ latitude: 23.7957, longitude: 86.4304 });
      calculateDistance(23.7957, 86.4304);
    }
  }, [calculateDistance]);

  // Open maps with doctor's location
  const openMaps = useCallback(() => {
    if (doctor?.latitude && doctor?.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${doctor.latitude},${doctor.longitude}`;
      window.open(mapsUrl, '_blank');
    } else {
      const address = `${doctor?.clinicName || ''}, ${doctor?.location || ''}`.trim();
      const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  }, [doctor?.latitude, doctor?.longitude, doctor?.clinicName, doctor?.location]);

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      // Wait a bit for Redux state to be available
      if (!isAuthenticated || role !== 'doctor') {
        setError('Please log in as a doctor to view your profile.');
        setLoading(false);
        return;
      }

      if (!user?.id) {
        setError('User data not available. Please try logging in again.');
        setLoading(false);
        return;
      }

      // Add a small delay to ensure Redux state is fully loaded
      await new Promise(resolve => setTimeout(resolve, 100));

      try {
        setLoading(true);
        // Use user.id as the doctor ID since in the auth system, user.id is the doctor's _id
        const response = await fetch(`/api/doctors/${user.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Doctor not found');
        }

        // Format doctor data for display
        const doctorData = {
          id: data.doctor._id,
          name: `Dr. ${data.doctor.firstName} ${data.doctor.lastName}`,
          firstName: data.doctor.firstName,
          lastName: data.doctor.lastName,
          specialization: data.doctor.specialization,
          experience: data.doctor.experience,
          qualification: data.doctor.qualification,
          bio: data.doctor.bio,
          avatar: data.doctor.avatar || '/icons/user-placeholder.png',
          clinicName: data.doctor.clinicName,
          clinicAddress: data.doctor.clinicAddress,
          consultationFee: data.doctor.consultationFee,
          phone: data.doctor.phone,
          email: data.doctor.email,
          location: data.doctor.location,
          language: data.doctor.language,
          coordinates: data.doctor.coordinates,
          awards: data.doctor.awards || [],
          services: data.doctor.services || [],
          pastExperiences: data.doctor.pastExperiences || [],
          weeklyAvailability: data.doctor.weeklyAvailability || {},
          gallery: data.doctor.gallery || [],
          isVerified: data.doctor.isProfileVerified && data.doctor.isDocumentsVerified,
          latitude: data.doctor.coordinates?.latitude || data.doctor.latitude || 23.7957,
          longitude: data.doctor.coordinates?.longitude || data.doctor.longitude || 86.4304
        };
        setDoctor(doctorData);

        // Set clinic images from doctor's gallery
        const clinicImages = data.doctor.gallery && data.doctor.gallery.length > 0 
          ? data.doctor.gallery.map((image, index) => ({
              id: image._id || index,
              src: image.url,
              alt: image.caption || `Clinic Image ${index + 1}`,
              placeholder: '🏥'
            }))
          : [];
        setClinicImages(clinicImages);
        
        // Fetch reviews
        try {
        const reviewsResponse = await fetch(`/api/doctors/${data.doctor._id}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const reviewsList = reviewsData.reviews || [];
          setReviews(reviewsList);
          
            // Use statistics from API if available, otherwise calculate manually
            if (reviewsData.statistics) {
              setReviewStats({
                averageRating: reviewsData.statistics.averageRating || 0,
                totalReviews: reviewsData.statistics.totalReviews || 0
              });
            } else {
              // Fallback calculation
          const totalReviews = reviewsList.length;
          const averageRating = totalReviews > 0 
            ? reviewsList.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
            : 0;
          
          setReviewStats({
            averageRating: averageRating,
            totalReviews: totalReviews
              });
            }
          } else {
            console.error('Failed to fetch reviews:', reviewsResponse.status);
            // Set default values if reviews fail to load
            setReviewStats({
              averageRating: 0,
              totalReviews: 0
            });
          }
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          // Set default values if reviews fail to load
          setReviewStats({
            averageRating: 0,
            totalReviews: 0
          });
        }

        // Fetch availability
        const availabilityResponse = await fetch(`/api/doctors/${data.doctor._id}/availability`);
        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json();
          setAvailability(availabilityData.availability);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [isAuthenticated, role, user?.id]);

  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Recalculate distance when doctor data is loaded
  useEffect(() => {
    if (doctor && userLocation) {
      calculateDistance(userLocation.latitude, userLocation.longitude);
    }
  }, [doctor, userLocation, calculateDistance]);

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


  if (loading || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#5f4191] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeW th={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-gray-600">Loading doctor profile...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{doctor?.name || 'Doctor'} - {doctor?.specialization || 'Specialist'} | Doctar</title>
        <meta name="description" content={`Doctor profile for ${doctor?.name || 'Doctor'}, ${doctor?.specialization || 'Specialist'}. ${doctor?.experience || 0} years experience.`} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-[#5f4191]">Home</Link></li>
              <li>/</li>
              <li><span className="text-gray-900">My Profile</span></li>
            </ol>
          </nav>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Doctor Info */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#5f4191] to-[#4d3374] rounded-2xl p-6 text-white sticky top-6">
                {/* Edit Button */}
                <div className="flex justify-end mb-4">
                  <Link
                    href="/doctor-profile/edit"
                    className="cursor-pointer bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    <span>Edit Profile</span>
                  </Link>
                </div>

                {/* Doctor Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 relative">
                    <Image
                      src={doctor?.avatar || '/icons/user-placeholder.png'}
                      alt={doctor?.name || 'Doctor'}
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    {doctor?.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-2.827 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Doctor Basic Info */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">{doctor?.name || 'Loading...'}</h1>
                  <p className="text-lg text-purple-100 font-medium mb-2">{doctor?.specialization || 'Specialist'}</p>
                  <p className="text-purple-200 text-sm mb-4">{doctor?.experience || 0} years experience</p>
                  
                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(reviewStats.averageRating)}
                    </div>
                    <span className="text-lg font-semibold">
                      {reviewStats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-purple-200 text-sm">
                      ({reviewStats.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Verification Badge */}
                  {doctor.isVerified && (
                    <div className="inline-flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  )}

                  {/* Clinic Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{doctor?.clinicName || 'Clinic Name'}</h3>
                    <p className="text-purple-200 text-sm mb-2">{doctor?.location || 'Location'}</p>
                    <p className="text-2xl font-bold">₹{doctor?.consultationFee || 0}</p>
                    <p className="text-purple-200 text-sm">Consultation Fee</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Tabs */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="p-6">
                  {/* Tab Navigation - Single Capsule Toggle */}
                  <div className="relative bg-gray-100 rounded-full p-1 mb-6 inline-block">
                    {/* Background slider that moves */}
                    <div 
                      className={`absolute top-1 bottom-1 bg-gradient-to-r from-[#5f4191] to-[#4d3374] rounded-full transition-all duration-300 ease-in-out shadow-lg`}
                      style={{
                        width: '33.33%', // 3 tabs = 33.33% each
                        left: `${['about', 'reviews', 'contact'].indexOf(activeTab) * 33.33}%`
                      }}
                    />
                    
                    {/* Tab buttons */}
                    <div className="relative flex">
                      {[
                        { id: 'about', label: 'About' },
                        { id: 'reviews', label: `Reviews` },
                        { id: 'contact', label: 'Contact' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative z-10 px-6 py-3 rounded-full font-medium text-sm transition-colors duration-300 min-w-0 flex-1 ${
                            activeTab === tab.id
                              ? 'text-white'
                              : 'text-gray-600 hover:text-gray-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Tab Content with Animation */}
                  <div className="transition-all duration-300 ease-in-out">
                  {/* About Tab */}
                  {activeTab === 'about' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Clinic Image Gallery */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Images</h3>
                        {clinicImages.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4">
                            {clinicImages.slice(0, 2).map((image, index) => (
                              <div key={image.id} className="relative group">
                                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                  <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="w-full h-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 hidden">
                                    <div className="text-center">
                                      <div className="text-4xl mb-2">{image.placeholder}</div>
                                      <p className="text-xs text-gray-500">{image.alt}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {clinicImages.length > 2 && (
                              <div className="relative group">
                                <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                  <div className="text-center text-white">
                                    <div className="text-2xl font-bold mb-1">+{clinicImages.length - 2}</div>
                                    <div className="text-xs">more</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-4xl mb-2">🏥</div>
                            <p className="text-gray-500">No clinic images uploaded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Upload images from your profile edit page</p>
                          </div>
                        )}
                      </div>

                      {/* Bio */}
                      {doctor.bio && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Dr. {doctor.lastName}</h3>
                            <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
                          </div>
                      )}

                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[#5f4191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.083 12.083 0 01.665-6.479L12 14z" />
                            </svg>
                            <span className="text-gray-700">{doctor.qualification}</span>
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {doctor.services?.map((service, index) => (
                            <div key={index} className="flex items-center space-x-2 text-gray-600">
                              <svg className="w-4 h-4 text-[#5f4191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">{service.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Awards */}
                      {doctor.awards && doctor.awards.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Awards & Recognition</h3>
                          <div className="space-y-3">
                            {doctor.awards.map((award, index) => (
                              <div key={index} className="border-l-4 border-[#5f4191] pl-4">
                                <div className="font-medium text-gray-900">{award.title}</div>
                                <div className="text-sm text-gray-600">{award.organization} - {award.year}</div>
                                {award.description && (
                                  <div className="text-sm text-gray-500 mt-1">{award.description}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Rating Summary */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</div>
                          <div className="flex items-center space-x-1">
                            {renderStars(reviewStats.averageRating)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600">Based on {reviewStats.totalReviews} reviews</p>
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="font-medium text-gray-900">{review.patientName}</span>
                                <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No reviews yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Tab */}
                  {activeTab === 'contact' && (
                    <div className="animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Location and Contact */}
                        <div className="space-y-6">
                          {/* Location Section */}
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-200">
                              <h3 className="text-lg font-bold text-gray-900">Location</h3>
                            </div>

                            <div className="h-48 bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl text-gray-400 mb-2">🗺️</div>
                                <p className="text-gray-500 text-sm">Interactive Map</p>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-purple-100">
                              <p className="text-gray-900 font-medium">
                                {doctor?.clinicName && `${doctor.clinicName}, `}
                                {doctor?.location || 'Dhanbad, Jharkhand 826004'}
                              </p>
                            </div>

                            <div className="px-4 py-4">
                              <div className="flex items-center justify-between">
                                <div className="text-center flex-1">
                                  <p className="text-xs text-gray-500 mb-1">Distance</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {distance.km > 0 ? `${distance.km} Km` : '8 Km'}
                                  </p>
                                </div>
                                
                                <div className="w-px h-12 bg-gray-300"></div>
                                
                                <div className="text-center flex-1">
                                  <p className="text-xs text-gray-500 mb-1">Time</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {distance.time > 0 ? `${distance.time} Mins` : '15 Mins'}
                                  </p>
                                </div>
                                
                                <div className="w-px h-12 bg-gray-300"></div>
                                
                                <div className="flex-1 flex justify-center">
                                  <button 
                                    onClick={openMaps}
                                    className="bg-[#5f4191] text-white p-3 rounded-full hover:bg-[#4d3374] transition-colors shadow-sm"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Section */}
                          <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                              <div className="bg-purple-100 rounded-lg p-3 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                  </svg>
                                </div>
                                <span className="text-gray-900 font-medium">{doctor.phone}</span>
                              </div>

                              <div className="bg-purple-100 rounded-lg p-3 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                </div>
                                <span className="text-gray-900 font-medium">{doctor.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Side - Weekly Schedule */}
                        <div className="space-y-6">
                          <WeeklySchedule 
                            weeklyAvailability={doctor?.weeklyAvailability} 
                            variant="default"
                            showInfo={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection 
          doctorName={doctor?.firstName || 'the doctor'} 
          consultationFee={doctor?.consultationFee || '500'} 
        />
      </div>
    </>
  );
}
