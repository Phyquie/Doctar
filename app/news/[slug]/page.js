'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt } from 'react-icons/fa';

export default function NewsDetailPage() {
  const params = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.slug) {
      fetchNews();
    }
  }, [params.slug]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news/${params.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
      } else {
        setError('News not found');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareNews = () => {
    if (navigator.share) {
      navigator.share({
        title: news.heading,
        text: news.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-300"></div>
              <div className="p-8">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">News Not Found</h1>
            <p className="text-gray-500 mb-6">The news article you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/news" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          href="/news" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to News
        </Link>

        {/* News Content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {news.images && news.images.length > 0 && (
            <div className="relative">
              <img 
                src={news.images[0]} 
                alt={news.heading}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm text-gray-600 font-medium">
                News
              </div>
            </div>
          )}

          <div className="p-8">
            {/* News Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {news.heading}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-6">
                  {news.author && (
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span>Dr. {news.author.firstName} {news.author.lastName}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                </div>
                
                <button
                  onClick={shareNews}
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <FaShareAlt className="mr-1" />
                  Share
                </button>
              </div>
            </header>

            {/* News Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.description}
              </div>
            </div>

            {/* Additional Images */}
            {news.images && news.images.length > 1 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">More Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${news.heading} ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            {news.author && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {news.author.firstName.charAt(0)}{news.author.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {news.author.firstName} {news.author.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Medical Professional
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related News or Call to Action */}
        <div className="mt-8 text-center">
          <Link 
            href="/news" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Read More News
          </Link>
        </div>
      </div>
    </div>
  );
}
