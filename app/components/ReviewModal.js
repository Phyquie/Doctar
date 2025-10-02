'use client';

import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectUser, selectIsAuthenticated, selectRole } from '../store/slices/authSlice';

export default function ReviewModal({ isOpen, onClose, doctorId, doctorName, onReviewSubmitted }) {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to submit a review');
      return;
    }
    
    if (role === 'doctor') {
      setError('Doctors cannot review other doctors');
      return;
    }
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!formData.comment.trim()) {
      setError('Please write a comment');
      return;
    }
    
    if (formData.comment.length > 1000) {
      setError('Comment must be less than 1000 characters');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/doctors/${doctorId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: `${user?.firstName} ${user?.lastName}`.trim() || 'Anonymous',
          rating: formData.rating,
          comment: formData.comment.trim(),
          patientId: user?.id
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }
      
      setSuccess('Review submitted successfully!');
      setFormData({ rating: 0, comment: '' });
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(result.review);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Review submission error:', error);
      setError(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => interactive && handleRatingChange(index + 1)}
        className={`w-8 h-8 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        disabled={!interactive}
      >
        <svg
          className={`w-full h-full ${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-sm mt-1">Share your experience with {doctorName}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars(formData.rating, true)}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment *
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              maxLength={1000}
              placeholder="Share your experience with this doctor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f4191] focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 characters
            </p>
          </div>

          {/* Authentication Check */}
          {!isAuthenticated && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">Please log in to submit a review.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isAuthenticated || isSubmitting || formData.rating === 0 || !formData.comment.trim()}
              className="flex-1 px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


