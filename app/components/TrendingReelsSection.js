'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaClock, FaMapMarkerAlt, FaUser, FaHeart, FaShare, FaTimes } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function TrendingReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [playingReel, setPlayingReel] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Get current location from Redux store
  const currentLocation = useAppSelector(selectCurrentLocation);

  useEffect(() => {
    setMounted(true);
    // Only fetch if we have a location (Redux store is ready)
    if (currentLocation) {
      fetchReels();
    }
  }, [currentLocation]); // Re-fetch when location changes

  const fetchReels = async () => {
    try {
      setLoading(true);
      
      // Get user location from Redux store
      const location = currentLocation?.city || currentLocation?.name || 'Mumbai';
      
      console.log('Fetching reels for location:', location, 'Full location object:', currentLocation);
      
      // Fetch reels with location filtering from Redux store
      const response = await fetch(`/api/reels?location=${encodeURIComponent(location)}&limit=6`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setReels(data.data.reels || []);
      } else {
        setError('Failed to fetch reels');
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
      setError('Failed to fetch reels');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${month} ${year}`;
  };

  const handleVideoClick = (reelId) => {
    if (playingReel === reelId) {
      // If same reel is clicked, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If different reel is clicked, start playing new reel
      setPlayingReel(reelId);
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setPlayingReel(null);
  };

  const handleCloseVideo = (reelId, e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setPlayingReel(null);
  };

  const extractVideoId = (url) => {
    if (!url) return null;
    
    // If it's an iframe HTML string, extract the src URL first
    if (url.includes('<iframe')) {
      const srcMatch = url.match(/src="([^"]+)"/);
      if (srcMatch) {
        url = srcMatch[1];
      }
    }
    
    // Handle YouTube URLs
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) return youtubeMatch[1];
    
    // Handle direct video URLs
    return url;
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    // Check both direct URL and iframe HTML content
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getSectionTitle = () => {
    const locationName = currentLocation?.city || currentLocation?.name || 'Local';
    return `Trending Shorts by ${locationName} Doctors `;
  };

  // Early return if Redux store is not ready yet
  if (!mounted || !currentLocation) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Loading Reels...</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] h-[600px] animate-pulse">
              <div className="h-96 bg-gray-300 rounded-t-4xl"></div>
              <div className="flex-col flex-1 p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">{getSectionTitle()}</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] h-[600px] animate-pulse">
              <div className="h-96 bg-gray-300 rounded-t-4xl"></div>
              <div className="flex-col flex-1 p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">{getSectionTitle()}</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] h-[600px] animate-pulse">
              <div className="h-96 bg-gray-300 rounded-t-4xl"></div>
              <div className="flex-col flex-1 p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">{getSectionTitle()}</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">Unable to load reels at the moment.</p>
        </div>
      </div>
    );
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">{getSectionTitle()}</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">No reels available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-[46px] mb-4 sm:mb-6">
        <h2 className="text-black text-xl sm:text-2xl font-bold mb-2 sm:mb-0">{getSectionTitle()}</h2>
        <Link 
          href="/shorts" 
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View All →
        </Link>
      </div>
      <div className="flex p-2 sm:p-6 overflow-auto scrollbar-hide scroll-smooth gap-3 sm:gap-4">
        {reels && reels.map((reel) => (
          <div 
            key={reel._id} 
            className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-[280px] sm:w-[300px] h-[480px] sm:h-[500px] hover:shadow-lg transition-shadow duration-300 flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              {playingReel === reel._id ? (
                // Video Player when playing - Reel aspect ratio (9:16)
                <div className="relative w-full h-80 sm:h-96 rounded-t-4xl overflow-hidden bg-black">
                  {(reel.iframeLink || reel.iframeUrl) && isYouTubeUrl(reel.iframeLink || reel.iframeUrl) ? (
                    // YouTube iframe with reel aspect ratio
                    <iframe
                      src={`https://www.youtube.com/embed/${extractVideoId(reel.iframeLink || reel.iframeUrl)}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                      title={reel.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (reel.iframeLink || reel.iframeUrl) ? (
                    // Other video URLs (direct video files)
                    <video
                      className="w-full h-full object-cover"
                      controls
                      autoPlay={isPlaying}
                      onEnded={handleVideoEnded}
                      preload="metadata"
                    >
                      <source src={reel.iframeLink || reel.iframeUrl} type="video/mp4" />
                      <source src={reel.iframeLink || reel.iframeUrl} type="video/webm" />
                      <source src={reel.iframeLink || reel.iframeUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                      <p className="text-center px-4">Video not available</p>
                    </div>
                  )}
                  {/* Play/Pause overlay for non-YouTube videos only */}
                  {(reel.iframeLink || reel.iframeUrl) && !isYouTubeUrl(reel.iframeLink || reel.iframeUrl) && (
                    <div 
                      className="absolute inset-0 bg-black/20 hover:bg-black/30 flex items-center justify-center cursor-pointer transition-colors opacity-0 hover:opacity-100"
                      onClick={() => handleVideoClick(reel._id)}
                    >
                      <div className="bg-white/90 rounded-full p-3">
                        {isPlaying ? (
                          <FaPause className="text-purple-600 text-xl" />
                        ) : (
                          <FaPlay className="text-purple-600 text-xl ml-1" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Thumbnail when not playing - Reel aspect ratio (9:16)
                <div 
                  className="relative w-full h-80 sm:h-96 cursor-pointer group"
                  onClick={() => handleVideoClick(reel._id)}
                >
                  {reel.thumbnail ? (
                    <img 
                      src={reel.thumbnail} 
                      alt={reel.title}
                      className="w-full h-80 sm:h-96 object-cover rounded-t-4xl group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-80 sm:h-96 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-4xl flex items-center justify-center">
                      <FaPlay className="text-white text-3xl sm:text-4xl" />
                    </div>
                  )}
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-t-4xl">
                    <div className="bg-white/90 rounded-full p-3">
                      <FaPlay className="text-purple-600 text-xl ml-1" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Overlay information */}
              {playingReel === reel._id ? (
                // Close button when video is playing
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleCloseVideo(reel._id, e)}
                    className="bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                // Category badge when showing thumbnail
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs text-gray-600">
                  {reel.category}
                </div>
              )}
              
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                <FaClock className="w-3 h-3 mr-1" />
                {formatDuration(reel.duration)}
              </div>
              {reel.isFeatured && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            <div className="flex-col flex-1 p-3 sm:p-4 overflow-hidden">
              <h3 className="text-lg sm:text-xl text-black font-bold line-clamp-2 mb-2 break-words">
                {reel.title}
              </h3>
              <div className="flex items-center justify-between mb-2 text-xs">
                <div className="flex items-center text-purple-600 font-medium">
                  <FaMapMarkerAlt className="w-3 h-3 mr-1" />
                  <span className="truncate">{reel.location}</span>
                </div>
                {reel.author && (
                  <span className="text-gray-500 truncate ml-2">
                    Dr. {reel.author.firstName} {reel.author.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
