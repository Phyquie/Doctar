'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlay, FaPause, FaClock, FaGraduationCap, FaMapMarkerAlt, FaUser, FaStar, FaHeart, FaShare, FaTimes } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function TrendingVideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Get current location from Redux store
  const currentLocation = useAppSelector(selectCurrentLocation);

  useEffect(() => {
    setMounted(true);
    // Only fetch if we have a location (Redux store is ready)
    if (currentLocation) {
      fetchVideos();
    }
  }, [currentLocation]); // Re-fetch when location changes

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // Get user location from Redux store
      const location = currentLocation?.city || currentLocation?.name || 'Mumbai';
      
      console.log('Fetching videos for location:', location, 'Full location object:', currentLocation);
      
      // Fetch videos with location filtering from Redux store
      const response = await fetch(`/api/videos?location=${encodeURIComponent(location)}&limit=10&featured=true`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setVideos(data.data.videos || []);
      } else {
        setError('Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'educational': 'bg-blue-100 text-blue-800',
      'medical-procedure': 'bg-red-100 text-red-800',
      'health-tips': 'bg-green-100 text-green-800',
      'wellness': 'bg-purple-100 text-purple-800',
      'patient-story': 'bg-orange-100 text-orange-800',
      'doctor-interview': 'bg-indigo-100 text-indigo-800',
      'hospital-tour': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.beginner;
  };

  const extractVideoId = (iframeUrl) => {
    // Extract YouTube video ID from various formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /src="[^"]*\/embed\/([^"?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = iframeUrl.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getThumbnailUrl = (video) => {
    if (video.thumbnail) return video.thumbnail;
    
    const videoId = extractVideoId(video.iframeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    
    return '/icons/video-placeholder.png';
  };

  const getSectionTitle = () => {
    const locationName = currentLocation?.city || currentLocation?.name || 'Local';
    return `Trending Videos by ${locationName} Doctors`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${month} ${year}`;
  };

  const handleVideoClick = (videoId) => {
    if (playingVideo === videoId) {
      // If same video is clicked, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If different video is clicked, start playing new video
      setPlayingVideo(videoId);
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setPlayingVideo(null);
  };

  const handleCloseVideo = (videoId, e) => {
    e.stopPropagation();
    setIsPlaying(false);
    setPlayingVideo(null);
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    // Check both direct URL and iframe HTML content
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderVideoCard = (video) => {
    const videoId = extractVideoId(video.iframeUrl);
    const thumbnailUrl = getThumbnailUrl(video);
    
    return (
      <div key={video._id} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-[280px] sm:w-[320px] h-[360px] sm:h-[380px] hover:shadow-lg transition-shadow duration-300 flex-shrink-0">
        <div className="relative flex-shrink-0">
          {playingVideo === video._id ? (
            // Video Player when playing
            <div className="relative w-full h-48 sm:h-64 rounded-t-4xl overflow-hidden bg-black">
              {(video.iframeUrl) && isYouTubeUrl(video.iframeUrl) ? (
                // YouTube iframe
                <iframe
                  src={`https://www.youtube.com/embed/${extractVideoId(video.iframeUrl)}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (video.iframeUrl) ? (
                // Other video URLs (direct video files)
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay={isPlaying}
                  onEnded={handleVideoEnded}
                  preload="metadata"
                >
                  <source src={video.iframeUrl} type="video/mp4" />
                  <source src={video.iframeUrl} type="video/webm" />
                  <source src={video.iframeUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                  <p className="text-center px-4">Video not available</p>
                </div>
              )}
              {/* Play/Pause overlay for non-YouTube videos only */}
              {(video.iframeUrl) && !isYouTubeUrl(video.iframeUrl) && (
                <div 
                  className="absolute inset-0 bg-black/20 hover:bg-black/30 flex items-center justify-center cursor-pointer transition-colors opacity-0 hover:opacity-100"
                  onClick={() => handleVideoClick(video._id)}
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
            // Thumbnail when not playing
            <div 
              className="relative w-full h-48 sm:h-64 cursor-pointer group"
              onClick={() => handleVideoClick(video._id)}
            >
              {video.thumbnail || thumbnailUrl ? (
                <img 
                  src={thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-48 sm:h-64 object-cover rounded-t-4xl group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.src = '/icons/video-placeholder.png';
                  }}
                />
              ) : (
                <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-4xl flex items-center justify-center">
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
          {playingVideo === video._id ? (
            // Close button when video is playing
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => handleCloseVideo(video._id, e)}
                className="bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 transition-colors"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          ) : (
            // Category badge when showing thumbnail
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs text-gray-600">
              {video.category?.replace('-', ' ')}
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
            <FaClock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </div>
          {video.isFeatured && (
            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              <FaStar className="w-3 h-3 mr-1 inline" />
              Featured
            </div>
          )}
        </div>

        <div className="flex-col flex-1 p-3 sm:p-4 overflow-hidden">
          <h3 className="text-base sm:text-lg text-black font-bold line-clamp-2 mb-2 break-words">
            {video.title}
          </h3>
          
          {/* Category and Difficulty Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(video.category)}`}>
              {video.category?.replace('-', ' ')}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(video.difficulty)}`}>
              <FaGraduationCap className="w-3 h-3 inline mr-1" />
              {video.difficulty}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center text-purple-600 font-medium">
              <FaMapMarkerAlt className="w-3 h-3 mr-1" />
              <span className="truncate">{video.location}</span>
            </div>
            {video.author && (
              <span className="text-gray-500 truncate ml-2">
                Dr. {video.author.firstName} {video.author.lastName}
              </span>
            )}
          </div>

         
        </div>
      </div>
    );
  };

  // Early return if Redux store is not ready yet
  if (!mounted || !currentLocation) {
    return (
      <div className="py-8">
        <h2 className="text-black text-2xl font-bold ml-[30px] mb-6">Loading Videos...</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[320px] h-[520px] animate-pulse">
              <div className="h-64 bg-gray-300 rounded-t-4xl"></div>
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="py-8">
        <h2 className="text-black text-2xl font-bold ml-[30px] mb-6">{getSectionTitle()}</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[320px] h-[520px] animate-pulse">
              <div className="h-64 bg-gray-300 rounded-t-4xl"></div>
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
      <div className="py-8">
        <h2 className="text-black text-2xl font-bold ml-[30px] mb-6">{getSectionTitle()}</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[320px] h-[520px] animate-pulse">
              <div className="h-64 bg-gray-300 rounded-t-4xl"></div>
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
      <div className="py-8">
        <h2 className="text-black text-2xl font-bold ml-[30px] mb-6">{getSectionTitle()}</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">Unable to load videos at the moment.</p>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-black text-2xl font-bold ml-[30px] mb-6">{getSectionTitle()}</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">No videos available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <h2 className="text-black text-xl sm:text-2xl font-bold mb-2 sm:mb-0">{getSectionTitle()}</h2>
        <Link 
          href="/videos" 
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View All →
        </Link>
      </div>

      <div className="flex p-2 sm:p-6 overflow-auto scrollbar-hide scroll-smooth gap-3 sm:gap-4">
        {videos && videos.map(renderVideoCard)}
      </div>
    </div>
  );
}


