'use client';

import React from 'react';

export default function WeeklySchedule({ 
  weeklyAvailability, 
  variant = 'default', // 'default' or 'colorful'
  showInfo = true 
}) {
  // Debug: Log weeklyAvailability data
  console.log('WeeklySchedule received weeklyAvailability:', weeklyAvailability);
  // Format time slots for display
  const formatTimeSlots = (timeSlots) => {
    if (!timeSlots || timeSlots.length === 0) {
      return 'Not Available';
    }
    
    if (timeSlots.length === 1) {
      return `${timeSlots[0].startTime} - ${timeSlots[0].endTime}`;
    }
    
    // Multiple time slots
    return timeSlots.map(slot => 
      `${slot.startTime} - ${slot.endTime}`
    ).join(', ');
  };

  // Get color scheme for different days
  const getDayColor = (day, isAvailable) => {
    if (!isAvailable) return { bg: 'bg-gray-200', text: 'text-gray-500' };
    
    if (variant === 'colorful') {
      const colors = {
        'Monday': { bg: 'bg-blue-100', text: 'text-blue-600' },
        'Tuesday': { bg: 'bg-green-100', text: 'text-green-600' },
        'Wednesday': { bg: 'bg-purple-100', text: 'text-purple-600' },
        'Thursday': { bg: 'bg-orange-100', text: 'text-orange-600' },
        'Friday': { bg: 'bg-pink-100', text: 'text-pink-600' },
        'Saturday': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
        'Sunday': { bg: 'bg-gray-200', text: 'text-gray-500' }
      };
      
      return colors[day] || { bg: 'bg-blue-100', text: 'text-blue-600' };
    }
    
    // Default variant
    return {
      bg: isAvailable ? (day === 'Saturday' ? 'bg-indigo-100' : 'bg-blue-100') : 'bg-gray-200',
      text: isAvailable ? (day === 'Saturday' ? 'text-indigo-600' : 'text-blue-600') : 'text-gray-500'
    };
  };

  // If no weeklyAvailability data, show a message
  if (!weeklyAvailability || Object.keys(weeklyAvailability).length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-500">Schedule not available</p>
          <p className="text-sm text-gray-400 mt-1">Doctor hasn't set their schedule yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
      <div className="space-y-3">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
          const dayKey = day.toLowerCase();
          const daySchedule = weeklyAvailability?.[dayKey];
          const isAvailable = daySchedule?.available || false;
          const timeSlots = daySchedule?.timeSlots || [];
          const dayColor = getDayColor(day, isAvailable);

          return (
            <div key={day} className={`flex items-center justify-between py-2 px-3 rounded-lg border ${
              !isAvailable ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${dayColor.bg} rounded-full flex items-center justify-center`}>
                  <span className={`text-xs font-semibold ${dayColor.text}`}>
                    {day.charAt(0)}
                  </span>
                </div>
                <span className={`font-medium ${
                  !isAvailable ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {day}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  !isAvailable ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {formatTimeSlots(timeSlots)}
                </div>
                <div className={`text-xs ${
                  !isAvailable ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {!isAvailable ? 'Not Available' : 
                   timeSlots.length > 1 ? 'Multiple Slots' : 'Available'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showInfo && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">Schedule Note</p>
              <p className="text-xs text-blue-700 mt-1">
                This is the doctor's current schedule. Times may vary based on availability and appointments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
