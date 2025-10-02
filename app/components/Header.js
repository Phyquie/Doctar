'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import LocationPicker from './LocationPicker';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectCurrentLocation, 
  selectIsLocationPickerOpen,
  setLocationPickerOpen 
} from '../store/slices/locationSlice';
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectRole,
  selectProfile,
  logout 
} from '../store/slices/authSlice';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const menuRef = useRef(null);
  
  // Get state from Redux
  const currentLocation = useAppSelector(selectCurrentLocation);
  const isLocationPickerOpen = useAppSelector(selectIsLocationPickerOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  console.log("user detail in header :", user);
  const role = useAppSelector(selectRole);
  const profile = useAppSelector(selectProfile);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Format location name for header display
  const formatLocationForHeader = (location) => {
    if (!location) return 'Select Location';
    
    // For current location, show a shortened version
    if (location.isCurrentLocation) {
      return location.city ? location.city : 'Current Location';
    }
    
    // For regular locations, show city or name
    if (location.city && location.city !== location.name) {
      return location.city;
    }
    
    // Truncate long names
    const name = location.name || 'Unknown Location';
    return name.length > 20 ? name.substring(0, 17) + '...' : name;
  };

  return (
        <header className="sticky top-0 z-50 bg-[#5f4191] text-white py-2 sm:py-4 px-4 lg:px-35">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo and Location */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/icons/logo.png"
                alt="Doctar Logo"
                width={128}
                height={40}
                className="object-contain w-20 h-6 sm:w-32 sm:h-10 cursor-pointer"
                unoptimized
              />
            </Link>
          </div>
          
          {/* Location Picker */}
          <div className="relative location-picker">
            <button
              onClick={() => dispatch(setLocationPickerOpen(!isLocationPickerOpen))}
              className="flex items-center space-x-1 sm:space-x-2   px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-opacity-30 transition-colors group"
              title={currentLocation.address || currentLocation.name || 'Click to change location'}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col items-start min-w-0 max-w-20 sm:max-w-none">
                <span className="text-xs sm:text-sm font-medium truncate">
                  {formatLocationForHeader(currentLocation)}
                </span>
              </div>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4 lg:mx-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const searchTerm = e.target.search.value;
              if (searchTerm.trim()) {
                window.location.href = `/doctors?search=${encodeURIComponent(searchTerm.trim())}`;
              } else {
                window.location.href = '/doctors';
              }
            }}
            className="relative"
          >
            <input
              name="search"
              type="text"
              placeholder="Search doctors..."
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#5f4191] text-white px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm hover:bg-[#4d3374] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* User Profile and Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Find Doctors Link */}
          
          
          {isAuthenticated ? (
            <>
              <span className="text-xs sm:text-sm hidden sm:block">
                Hi {user?.firstName || 'User'}
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 border-[#5f4191] flex-shrink-0">
                {profile?.avatar || user?.avatar ? (
                  <Image
                    src={profile?.avatar || user?.avatar || '/icons/user-placeholder.png'}
                    alt="Profile Picture"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-[#5f4191] flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-semibold">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 sm:p-2 hover:bg-[#7959ad] rounded"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                      </div>
                      
                      {role === 'patient' ? (
                        <a
                          href="/patient-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </a>
                      ) : (
                        <>
                          
                          <a
                            href="/doctor-profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Doctor Profile
                          </a>
                          
                        </>
                      )}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={() => {
                            dispatch(logout());
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <a
                href="/auth/login"
                className="text-xs sm:text-sm text-white hover:text-gray-200 transition-colors"
              >
                Sign In
              </a>
              <a
                href="/auth"
                className="px-3 py-1 sm:px-4 sm:py-2 bg-white text-[#5f4191] rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker />
    </header>
  );
}
