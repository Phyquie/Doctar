'use client';

import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaClock, FaGraduationCap, FaMapMarkerAlt, FaUser, FaStar, FaHeart, FaShare, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAppSelector } from '../store/hooks';
import { selectCurrentLocation } from '../store/slices/locationSlice';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const videosPerPage = 12;
  
  // Filter state
  const [viewMode, setViewMode] = useState('local'); // 'local' or 'global'
  
  // Get current location from Redux store
  const currentLocation = useAppSelector(selectCurrentLocation);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchVideos();
    }
  }, [mounted, currentPage, viewMode, currentLocation]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build API parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', videosPerPage.toString());
      
      // Location filtering
      if (viewMode === 'local' && currentLocation) {
        const location = currentLocation?.city || currentLocation?.name || 'Mumbai';
        params.append('location', location);
      }
      

      
      console.log('Fetching videos with params:', params.toString());
      
      const response = await fetch(`/api/videos?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setVideos(data.data.videos || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalVideos(data.data.pagination?.totalVideos || 0);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(1); // Reset to first page when changing view mode
  };



  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
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

  const handleVideoClick = (videoId) => {
    if (playingVideo === videoId) {
      setIsPlaying(!isPlaying);
    } else {
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

  const extractVideoId = (iframeUrl) => {
    if (!iframeUrl) return null;
    
    if (iframeUrl.includes('<iframe')) {
      const srcMatch = iframeUrl.match(/src="([^"]+)"/);
      if (srcMatch) iframeUrl = srcMatch[1];
    }
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /src="[^"]*\/embed\/([^"?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = iframeUrl.match(pattern);
      if (match) return match[1];
    }
    return iframeUrl;
  };

  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTitle = () => {
    if (viewMode === 'local') {
      const locationName = currentLocation?.city || currentLocation?.name || 'Local';
      return `${locationName} Medical Videos`;
    }
    return 'Global Medical Videos';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8 mb-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="w-3 h-3 mr-1" />
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border ${
              page === currentPage
                ? 'text-purple-600 bg-purple-50 border-purple-500'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <FaChevronRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {Array.from({ length: videosPerPage }).map((_, i) => (
        <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-full h-[520px] animate-pulse">
          <div className="h-96 bg-gray-300 rounded-t-4xl"></div>
          <div className="flex-col flex-1 p-4">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-300 rounded-full w-16"></div>
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto">
          <div className="pt-8 pb-4">
            <h1 className="text-3xl font-bold text-center text-gray-900">Loading Medical Videos...</h1>
          </div>
          {renderSkeletons()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">{getTitle()}</h1>
          
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => handleViewModeChange('local')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'local'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                Local Area
              </button>
              <button
                onClick={() => handleViewModeChange('global')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'global'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <FaUser className="inline w-4 h-4 mr-2" />
                Global
              </button>
            </div>
          </div>



          {/* Results Info */}
          <div className="text-center text-gray-600 mb-4">
            {loading ? (
              'Loading videos...'
            ) : (
              `Showing ${videos.length} of ${totalVideos} videos ${viewMode === 'local' ? `in ${currentLocation?.city || currentLocation?.name || 'your area'}` : 'globally'}`
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          renderSkeletons()
        ) : error ? (
          <div className="p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Unable to load videos</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <button
                onClick={fetchVideos}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="p-6 text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-gray-600 font-medium">No videos found</p>
              <p className="text-gray-500 text-sm mt-2">
                {viewMode === 'local' 
                  ? 'Try switching to global view or check back later for new content.'
                  : 'Check back later for new content.'
                }
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {videos.map((video) => (
                <div 
                  key={video._id} 
                  className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-full h-[360px] hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative flex-shrink-0">
                    {playingVideo === video._id ? (
                      <div className="relative w-full h-64 rounded-t-4xl overflow-hidden bg-black">
                        {(video.iframeUrl || video.iframeLink) && isYouTubeUrl(video.iframeUrl || video.iframeLink) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractVideoId(video.iframeUrl || video.iframeLink)}?autoplay=${isPlaying ? 1 : 0}&controls=1&rel=0&modestbranding=1`}
                            title={video.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (video.iframeUrl || video.iframeLink) ? (
                          <video
                            className="w-full h-full object-cover"
                            controls
                            autoPlay={isPlaying}
                            onEnded={handleVideoEnded}
                            preload="metadata"
                          >
                            <source src={video.iframeUrl || video.iframeLink} type="video/mp4" />
                            <source src={video.iframeUrl || video.iframeLink} type="video/webm" />
                            <source src={video.iframeUrl || video.iframeLink} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                            <p className="text-center px-4">Video not available</p>
                          </div>
                        )}
                        {(video.iframeUrl || video.iframeLink) && !isYouTubeUrl(video.iframeUrl || video.iframeLink) && (
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
                      <div 
                        className="relative w-full h-64 cursor-pointer group"
                        onClick={() => handleVideoClick(video._id)}
                      >
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-64 object-cover rounded-t-4xl group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-4xl flex items-center justify-center">
                            <FaPlay className="text-white text-4xl" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-t-4xl">
                          <div className="bg-white/90 rounded-full p-3">
                            <FaPlay className="text-purple-600 text-xl ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {playingVideo === video._id ? (
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => handleCloseVideo(video._id, e)}
                          className="bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full p-2 transition-colors"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        {video.category && (
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(video.category)}`}>
                            {video.category.replace('-', ' ')}
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                      <FaClock className="w-3 h-3 mr-1" />
                      {formatDuration(video.duration)}
                    </div>
                    
                    {video.isFeatured && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-col flex-1 p-4 overflow-hidden">
                    <h3 className="text-lg text-black font-bold line-clamp-2 mb-2 break-words">
                      {truncateText(video.title, 60)}
                    </h3>
                    
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
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}
