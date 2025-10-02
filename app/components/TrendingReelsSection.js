'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlay, FaClock, FaMapMarkerAlt, FaUser, FaHeart, FaShare } from 'react-icons/fa';

export default function TrendingReelsSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reels?limit=6&featured=true');
      const data = await response.json();
      
      if (data.success) {
        setReels(data.data.reels);
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
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Trending Reels & Shorts</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] h-[400px] animate-pulse">
              <div className="h-48 bg-gray-300 rounded-t-4xl"></div>
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
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Trending Reels & Shorts</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] h-[400px] animate-pulse">
              <div className="h-48 bg-gray-300 rounded-t-4xl"></div>
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
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Trending Reels & Shorts</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">Unable to load reels at the moment.</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Trending Reels & Shorts</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">No reels available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mt-[46px] ml-[30px] mr-[30px]">
        <h2 className="text-black text-2xl font-bold">Trending Reels & Shorts</h2>
        <Link 
          href="/reels" 
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View All →
        </Link>
      </div>
      <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
        {reels.map((reel) => (
          <div 
            key={reel._id} 
            className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-[300px] h-[400px] hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative flex-shrink-0">
              {reel.thumbnail ? (
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title}
                  className="w-full h-48 object-cover rounded-t-4xl"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-4xl flex items-center justify-center">
                  <FaPlay className="text-white text-4xl" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs text-gray-600">
                {reel.category}
              </div>
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
            <div className="flex-col flex-1 p-4 overflow-hidden">
              <h3 className="text-xl text-black font-bold line-clamp-2 mb-2 break-words">
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
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide max-h-32">
                <p className="text-gray-500 text-sm leading-relaxed break-words">
                  {reel.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <FaHeart className="w-3 h-3 mr-1" />
                    {reel.likeCount || 0}
                  </span>
                  <span className="flex items-center">
                    <FaShare className="w-3 h-3 mr-1" />
                    {reel.shareCount || 0}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(reel.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
