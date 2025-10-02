'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import FAQSection from '../../../components/FAQSection';
import WeeklySchedule from '../../../components/WeeklySchedule';

// Dynamically import the map components to avoid SSR issues
const MapComponent = dynamic(() => import('../../../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
});

const ClinicMapComponent = dynamic(() => import('../../../components/ClinicMapComponent'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">Loading clinic map...</div>
});

export default function PublicDoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { location, doctorSlug } = params;
  
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
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    patientName: '',
    email: ''
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  // Calculate distance between user location and doctor's clinic location
  const calculateDistance = useCallback((userLat, userLng) => {
    const clinicLat = doctor?.clinicCoordinates?.latitude;
    const clinicLng = doctor?.clinicCoordinates?.longitude;
    
    if (!clinicLat || !clinicLng) return;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (clinicLat - userLat) * Math.PI / 180;
    const dLng = (clinicLng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(clinicLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    
    // Estimate travel time based on distance
    let timeMinutes;
    if (distanceKm <= 5) {
      // City/local travel: 25 km/h average (traffic, signals)
      timeMinutes = Math.round((distanceKm / 25) * 60);
    } else if (distanceKm <= 20) {
      // Suburban: 35 km/h average
      timeMinutes = Math.round((distanceKm / 35) * 60);
    } else {
      // Highway/long distance: 50 km/h average
      timeMinutes = Math.round((distanceKm / 50) * 60);
    }
    
    setDistance({
      km: Math.round(distanceKm * 10) / 10, // Round to 1 decimal place
      time: Math.max(timeMinutes, 5) // Minimum 5 minutes
    });
  }, [doctor?.clinicCoordinates?.latitude, doctor?.clinicCoordinates?.longitude]);

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
          // Set default location if geolocation fails
          setUserLocation({ latitude: 23.7957, longitude: 86.4304 }); // Dhanbad coordinates
          calculateDistance(23.7957, 86.4304);
        }
      );
    } else {
      console.error('Geolocation is not supported');
      // Set default location
      setUserLocation({ latitude: 23.7957, longitude: 86.4304 });
      calculateDistance(23.7957, 86.4304);
    }
  }, [calculateDistance]);

  // Open Google Maps with route from user location to clinic
  const openMaps = useCallback(() => {
    const clinicLat = doctor?.clinicCoordinates?.latitude;
    const clinicLng = doctor?.clinicCoordinates?.longitude;
    
    if (clinicLat && clinicLng) {
      let mapsUrl;
      
      if (userLocation) {
        // Open directions from user location to clinic
        mapsUrl = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${clinicLat},${clinicLng}`;
      } else {
        // Just show clinic location
        mapsUrl = `https://www.google.com/maps?q=${clinicLat},${clinicLng}`;
      }
      
      window.open(mapsUrl, '_blank');
    } else {
      // Fallback to address-based search
      const address = `${doctor?.clinicAddress || doctor?.clinicName || doctor?.location || ''}`.trim();
      if (address) {
        const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
      }
    }
  }, [doctor?.clinicCoordinates?.latitude, doctor?.clinicCoordinates?.longitude, doctor?.clinicAddress, doctor?.clinicName, doctor?.location, userLocation]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      alert('Please log in to submit a review.');
      router.push('/auth/login');
      return;
    }
    
    // Check if user is a patient
    if (role !== 'patient') {
      alert('Only patients can submit reviews.');
      return;
    }
    
    // Check if doctor data is available
    if (!doctor || !doctor.id) {
      alert('Doctor information not available. Please refresh the page and try again.');
      return;
    }
    
    setReviewLoading(true);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          rating: newReview.rating,
          comment: newReview.comment,
          patientName: user?.firstName + ' ' + user?.lastName || newReview.patientName,
          email: user?.email || newReview.email
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh reviews
        const updatedReviews = [...reviews, {
          ...newReview,
          _id: result.review.id,
          patientName: user?.firstName + ' ' + user?.lastName || newReview.patientName,
          createdAt: result.review.createdAt
        }];
        setReviews(updatedReviews);
        
        // Recalculate review statistics
        const totalReviews = updatedReviews.length;
        const averageRating = totalReviews > 0 
          ? updatedReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;
        
        setReviewStats({
          averageRating: averageRating,
          totalReviews: totalReviews
        });
        
        // Reset form
        setNewReview({
          rating: 5,
          comment: '',
          patientName: '',
          email: ''
        });
        setShowReviewModal(false);
        
        // Show success message
        alert('Review submitted successfully!');
      } else {
        throw new Error(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors/public/${doctorSlug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Doctor not found');
        }

        // Use doctor data directly from API (includes clinicCoordinates)
        const doctorData = data.doctor;
        
        // Debug: Log weeklyAvailability data
        console.log('Doctor weeklyAvailability:', data.doctor.weeklyAvailability);
        
        setDoctor(doctorData);

        // Set clinic images from doctor's gallery
        const clinicImages = data.doctor.gallery && data.doctor.gallery.length > 0 
          ? data.doctor.gallery.map((image, index) => ({
              id: image._id || index,
              src: image.url,
              alt: image.caption || `Clinic Image ${index + 1}`,
              placeholder: '🏥' // Default placeholder if image fails to load
            }))
          : [
              // Fallback sample images if no gallery images
              {
                id: 1,
                src: '/images/clinic-reception.jpg',
                alt: 'Clinic Reception Area',
                placeholder: '🏥'
              },
              {
                id: 2,
                src: '/images/clinic-consultation.jpg',
                alt: 'Consultation Room',
                placeholder: '🩺'
              },
              {
                id: 3,
                src: '/images/clinic-waiting.jpg',
                alt: 'Waiting Area',
                placeholder: '🪑'
              }
            ];
        setClinicImages(clinicImages);
        
        // Fetch reviews
        try {
          const reviewsResponse = await fetch(`/api/doctors/${data.doctor.id}/reviews`);
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
        const availabilityResponse = await fetch(`/api/doctors/${data.doctor.id}/availability`);
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

    if (doctorSlug) {
      fetchDoctorData();
    }
  }, [doctorSlug]);

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

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The doctor you are looking for does not exist.'}</p>
          <Link
            href="/doctors"
            className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
          >
            Browse All Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Global styles for map z-index conflicts */}
      <style jsx global>{`
        .leaflet-pane {
          z-index: 1 !important;
        }
        .leaflet-control-container {
          z-index: 2 !important;
        }
        .leaflet-popup-pane {
          z-index: 3 !important;
        }
        .leaflet-tooltip-pane {
          z-index: 3 !important;
        }
        .leaflet-marker-pane {
          z-index: 2 !important;
        }
      `}</style>
      <Head>
        <title>{doctor?.name || 'Doctor'} - {doctor?.specialization || 'Specialist'} in {doctor?.location || 'Location'} | Doctar</title>
        <meta name="description" content={`Book appointment with ${doctor?.name || 'Doctor'}, ${doctor?.specialization || 'Specialist'} in ${doctor?.location || 'Location'}. ${doctor?.experience || 0} years experience. Consultation fee ₹${doctor?.consultationFee || 0}. Verified doctor on Doctar.`} />
        <meta name="keywords" content={`${doctor?.name || 'Doctor'}, ${doctor?.specialization || 'Specialist'}, ${doctor?.location || 'Location'}, doctor appointment, medical consultation, ${doctor?.clinicName || 'Clinic'}`} />
        <meta property="og:title" content={`${doctor?.name || 'Doctor'} - ${doctor?.specialization || 'Specialist'} in ${doctor?.location || 'Location'}`} />
        <meta property="og:description" content={`Book appointment with ${doctor?.name || 'Doctor'}, ${doctor?.specialization || 'Specialist'} in ${doctor?.location || 'Location'}. ${doctor?.experience || 0} years experience.`} />
        <meta property="og:image" content={doctor?.avatar || '/icons/user-placeholder.png'} />
        <meta property="og:url" content={`https://doctar.com/doctors/${location}/${doctorSlug}`} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${doctor?.name || 'Doctor'} - ${doctor?.specialization || 'Specialist'} in ${doctor?.location || 'Location'}`} />
        <meta name="twitter:description" content={`Book appointment with ${doctor?.name || 'Doctor'}, ${doctor?.specialization || 'Specialist'} in ${doctor?.location || 'Location'}.`} />
        <meta name="twitter:image" content={doctor?.avatar || '/icons/user-placeholder.png'} />
        <link rel="canonical" href={`https://doctar.com/doctors/${location}/${doctorSlug}`} />
        {doctor && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": doctor.name,
              "jobTitle": doctor.specialization,
              "description": doctor.bio,
              "image": doctor.avatar,
              "url": `https://doctar.com/doctors/${location}/${doctorSlug}`,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": doctor.clinicAddress,
                "addressLocality": doctor.location
              },
              "worksFor": {
                "@type": "Organization",
                "name": doctor.clinicName
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": doctor.rating,
                "reviewCount": doctor.reviewCount
              }
            })}
          </script>
        )}
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-[#5f4191]">Home</Link></li>
            <li>/</li>
            <li><Link href="/doctors" className="hover:text-[#5f4191]">Doctors</Link></li>
            <li>/</li>
            <li><Link href={`/doctors?location=${encodeURIComponent(doctor?.location || location)}`} className="hover:text-[#5f4191]">{doctor?.location || location}</Link></li>
            <li>/</li>
            <li className="text-gray-900">{doctor?.name || 'Doctor'}</li>
          </ol>
        </nav>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Doctor Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#5f4191] to-[#4d3374] rounded-xl shadow-lg p-6 text-white sticky top-6">
              {/* Doctor Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 relative">
                  <Image
                    src={doctor.avatar}
                    alt={doctor.name}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {doctor.isVerified && (
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
                <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-lg text-purple-100 font-medium mb-2">{doctor.specialization}</p>
                <p className="text-purple-200 text-sm mb-4">{doctor.experience} years experience</p>
                
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
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-2.827 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                )}
             
              </div>

              {/* Bio and Language */}
              <div className="space-y-3 text-sm">
                {doctor.bio && (
                  <div>
                    <span className="block text-purple-100 font-semibold mb-1">Bio:</span>
                    <p className="text-purple-100">{doctor.bio}</p>
                  </div>
                )}
                {doctor.language && (
                  <div>
                    <span className="block text-purple-100 font-semibold mb-1">Language:</span>
                    <p className="text-purple-100">{doctor.language}</p>
                  </div>
                )}
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
                      <div className="grid grid-cols-3 gap-4">
                        {/* Show first 3 clinic images */}
                        {clinicImages.slice(0, 2).map((image, index) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              {image.src && !image.src.includes('/images/') ? (
                                // Real image from database
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              {/* Fallback placeholder */}
                              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 ${image.src && !image.src.includes('/images/') ? 'hidden' : 'flex'}`}>
                                <div className="text-center">
                                  <div className="text-4xl mb-2">{image.placeholder}</div>
                                  <p className="text-xs text-gray-500">{image.alt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Show "+X more" if there are more than 3 images */}
                        {clinicImages.length > 3 && (
                          <div className="relative group">
                            <div className="aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-2xl font-bold mb-1">+{clinicImages.length - 3}</div>
                                <div className="text-xs">more</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
                        {isAuthenticated && role === 'patient' ? (
                          <button
                            onClick={() => setShowReviewModal(true)}
                            className="bg-[#5f4191] text-white px-4 py-2 rounded-lg hover:bg-[#4d3374] transition-colors font-medium"
                          >
                            Write Review
                          </button>
                        ) : isAuthenticated && role === 'doctor' ? (
                          <span className="text-gray-500 text-sm">Doctors cannot review other doctors</span>
                        ) : (
                          <button
                            onClick={() => router.push('/auth/login')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                          >
                            Login to Review
                          </button>
                        )}
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
                              <span className="text-sm text-gray-500">{review.age}</span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            {review.doctorResponse && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-900 mb-1">Doctor&apos;s Response:</div>
                                <p className="text-sm text-blue-800">{review.doctorResponse.comment}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
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
                          {/* Location Section - Matching Image Design */}
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
                            {/* Location Header */}
                            <div className="px-4 py-3 border-b border-gray-200">
                              <h3 className="text-lg font-bold text-gray-900">Location</h3>
                            </div>

                            {/* Interactive Map */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                              {doctor.clinicCoordinates?.latitude && doctor.clinicCoordinates?.longitude ? (
                                <ClinicMapComponent
                                  clinicLocation={{
                                    lat: parseFloat(doctor.clinicCoordinates.latitude),
                                    lng: parseFloat(doctor.clinicCoordinates.longitude),
                                    name: doctor.clinicName || 'Clinic Location',
                                    address: doctor.clinicAddress || `${doctor.clinicName}, ${doctor.location}`
                                  }}
                                  height="192px"
                                />
                              ) : (
                                <div className="h-full flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-4xl text-gray-400 mb-2">�</div>
                                    <p className="text-gray-500 text-sm">Location not available</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Address Bar */}
                            <div className="px-4 py-3 bg-purple-100">
                              <p className="text-gray-900 font-medium">
                                {doctor?.clinicName && `${doctor.clinicName}, `}
                                {doctor?.location || 'Dhanbad, Jharkhand 826004'}
                              </p>
                            </div>

                            {/* Distance, Time and Directions */}
                            <div className="px-4 py-4">
                              <div className="flex items-center justify-between">
                                {/* Distance */}
                                <div className="text-center flex-1">
                                  <p className="text-xs text-gray-500 mb-1">Distance</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {distance.km > 0 ? `${distance.km} Km` : '8 Km'}
                                  </p>
                                </div>
                                
                                {/* Divider */}
                                <div className="w-px h-12 bg-gray-300"></div>
                                
                                {/* Time */}
                                <div className="text-center flex-1">
                                  <p className="text-xs text-gray-500 mb-1">Time</p>
                                  <p className="text-lg font-bold text-gray-900">
                                    {distance.time > 0 ? `${distance.time} Mins` : '15 Mins'}
                                  </p>
                                </div>
                                
                                {/* Divider */}
                                <div className="w-px h-12 bg-gray-300"></div>
                                
                                {/* Directions Button */}
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor</h3>
                            <div className="space-y-3">
                              {/* Phone Contact */}
                              <div className="bg-purple-100 rounded-lg p-3 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                  </svg>
                                </div>
                                <span className="text-gray-900 font-medium">+91 {doctor.phone}</span>
                              </div>

                              {/* WhatsApp Contact */}
                              <div className="bg-purple-100 rounded-lg p-3 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.214-.366a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                  </svg>
                                </div>
                                <span className="text-gray-900 font-medium">+91 {doctor.phone}</span>
                              </div>

                              {/* Email Contact */}
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

                        {/* Right Side - Weekly Schedule & Location */}
                        <div className="space-y-6">
                          <WeeklySchedule 
                            weeklyAvailability={doctor?.weeklyAvailability} 
                            variant="colorful"
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

        {/* FAQ Section - Bottom of Page */}
        <FAQSection 
          doctorName={doctor?.firstName || 'the doctor'} 
          consultationFee={doctor?.consultationFee || '500'} 
        />

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({...newReview, rating: star})}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-8 h-8 ${
                              star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Patient Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={isAuthenticated ? (user?.firstName + ' ' + user?.lastName) : newReview.patientName}
                      onChange={(e) => setNewReview({...newReview, patientName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                      placeholder="Enter your name"
                      disabled={isAuthenticated}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={isAuthenticated ? user?.email : newReview.email}
                      onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                      placeholder="Enter your email"
                      disabled={isAuthenticated}
                      required
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
                      placeholder={`Share your experience with Dr. ${doctor?.firstName}`}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="flex-1 bg-[#5f4191] text-white px-4 py-2 rounded-lg hover:bg-[#4d3374] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
