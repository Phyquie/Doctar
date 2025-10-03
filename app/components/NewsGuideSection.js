'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewsGuideSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data.news);
      } else {
        setError('Failed to fetch news');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">Latest News & Guides</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-[300px] h-[400px] animate-pulse">
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
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">News & Guide</h2>
        <div className="flex p-6 overflow-auto scrollbar-hide scroll-smooth gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow min-w-[300px] animate-pulse">
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
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">News & Guide</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">Unable to load news at the moment.</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="mt-6">
        <h2 className="text-black text-2xl font-bold mt-[46px] ml-[30px]">News & Guide</h2>
        <div className="p-6 text-center">
          <p className="text-gray-500">No news available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 sm:mt-[46px] mb-4 sm:mb-6">
        <h2 className="text-black text-xl sm:text-2xl font-bold mb-2 sm:mb-0">News & Guide</h2>
        <Link 
          href="/news" 
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View All →
        </Link>
      </div>
      <div className="flex p-2 sm:p-6 overflow-auto scrollbar-hide scroll-smooth gap-3 sm:gap-4">
        {news.map((newsItem) => (
          <Link 
            key={newsItem._id} 
            href={`/news/${newsItem.slug || newsItem._id}`}
            className="flex-col flex bg-[#f2f1f9] rounded-4xl shadow w-[280px] sm:w-[300px] h-[380px] sm:h-[400px] hover:shadow-lg transition-shadow duration-300 flex-shrink-0"
          >
            <div className="relative flex-shrink-0">
              {newsItem.images && newsItem.images.length > 0 ? (
                <img 
                  src={newsItem.images[0]} 
                  alt={newsItem.heading}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-4xl"
                />
              ) : (
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-4xl flex items-center justify-center">
                  <span className="text-white text-3xl sm:text-4xl font-bold">📰</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs text-gray-600">
                News
              </div>
            </div>
            <div className="flex-col flex-1 p-3 sm:p-4 overflow-hidden">
              <h3 className="text-lg sm:text-xl text-black font-bold line-clamp-2 mb-2 break-words">
                {newsItem.heading}
              </h3>
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-purple-600 font-medium truncate">
                  {formatDate(newsItem.createdAt)}
                </span>
                {newsItem.author && (
                  <span className="text-gray-500 truncate ml-2">
                    Dr. {newsItem.author.firstName} {newsItem.author.lastName}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide max-h-24 sm:max-h-32">
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed break-words">
                  {newsItem.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


