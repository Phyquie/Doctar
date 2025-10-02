'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaShareAlt } from 'react-icons/fa';

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${params.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setBlog(data.data);
      } else {
        setError('Blog not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog');
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

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.heading,
        text: blog.description,
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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h1>
            <p className="text-gray-500 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/blogs" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blogs
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
          href="/blogs" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blogs
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Featured Image */}
          {blog.images && blog.images.length > 0 && (
            <div className="relative">
              <img 
                src={blog.images[0]} 
                alt={blog.heading}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm text-gray-600 font-medium">
                Blog
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Blog Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.heading}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-6">
                  {blog.author && (
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span>Dr. {blog.author.firstName} {blog.author.lastName}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
                
                <button
                  onClick={shareBlog}
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <FaShareAlt className="mr-1" />
                  Share
                </button>
              </div>
            </header>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.description}
              </div>
            </div>

            {/* Additional Images */}
            {blog.images && blog.images.length > 1 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">More Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${blog.heading} ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            {blog.author && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {blog.author.firstName.charAt(0)}{blog.author.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {blog.author.firstName} {blog.author.lastName}
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

        {/* Related Blogs or Call to Action */}
        <div className="mt-8 text-center">
          <Link 
            href="/blogs" 
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Read More Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
