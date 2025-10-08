'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import LocationPicker from './LocationPicker';
import SearchBar from './SearchBar';
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
  
  // Format location name for header display
  const formatLocationForHeader = (location) => {
    if (!location) return 'Bengaluru';
    
    // For current location, show a shortened version
    if (location.isCurrentLocation) {
      return location.city ? location.city : 'Current Location';
    }
    
    // For regular locations, prioritize city over name
    if (location.city) {
      return location.city;
    }
    
    // Fallback to name
    const name = location.name || 'Bengaluru';
    return name.length > 20 ? name.substring(0, 17) + '...' : name;
  };
  
  // Debug logging removed
  
  // Force re-render when location changes
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [currentLocation]);
  
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

  return (
    <div className="sticky top-0 z-[100] shadow-2xl">
      {/* Main Header */}
      <div className="flex items-center justify-between p-2 px-4 md:p-4 md:px-10 bg-[#5f4191]">
        
        {/* LEFT CLUSTER: On desktop, show logo then location; on mobile, only location */}
        <div className="flex items-center gap-3">
          {/* Desktop logo at far-left */}
          <div className="hidden md:block">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/icons/logo.png"
                alt="Doctar Logo"
                width={128}
                height={40}
                className="w-32 h-auto cursor-pointer"
                unoptimized
              />
            </Link>
          </div>

          {/* Location selector (mobile and desktop) */}
          <div className="relative">
            <button
              onClick={() => dispatch(setLocationPickerOpen(!isLocationPickerOpen))}
              className="flex w-[120px] md:w-[140px] items-center gap-2 bg-white hover:bg-white text-black font-medium px-3 py-1 rounded-md transition"
              title={currentLocation?.address || currentLocation?.name || 'Click to change location'}
              style={{ minHeight: '40px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 w-4 h-4">
                <path fillRule="evenodd" d="M11.54 22.35a.75.75 0 0 0 .92 0c1.14-.87 2.67-2.2 4.04-3.78C18.92 16.82 21 14.2 21 11.25 21 6.7 17.52 3 12.75 3S4.5 6.7 4.5 11.25c0 2.95 2.08 5.57 4.5 7.32 1.37 1.58 2.9 2.9 4.04 3.78Zm1.21-9.6a3 3 0 1 0-4.5-3.9 3 3 0 0 0 4.5 3.9Z" clipRule="evenodd" />
              </svg>
              <span className="text-black text-sm flex-1 truncate" title={formatLocationForHeader(currentLocation) || 'Bengaluru'}>
                {formatLocationForHeader(currentLocation) || 'Bengaluru'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`flex-shrink-0 w-4 h-4 transition-transform ${
                  isLocationPickerOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M12 14.25a.75.75 0 0 1-.53-.22l-4.5-4.5a.75.75 0 0 1 1.06-1.06L12 12.44l3.97-3.97a.75.75 0 0 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-.53.22Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* CENTER: Search bar for desktop only */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-md">
          <SearchBar placeholder="Search doctors, specialties, locations..." />
        </div>

        {/* Mobile: centered logo */}
        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/icons/logo.png"
              alt="Doctar Logo"
              width={96}
              height={30}
              className="w-24 h-auto cursor-pointer"
              unoptimized
            />
          </Link>
        </div>

        {/* RIGHT: Profile / Auth */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {/* Desktop: Show greeting */}
              <div className="hidden md:flex items-center space-x-1">
                <span className="text-white font-medium">Hi,</span>
                <span className="text-white font-medium">{user?.firstName || 'User'}</span>
              </div>
              <button
                onClick={() => {
                  const profileUrl = role === 'doctor' ? '/doctor-profile' : 
                                   role === 'patient' ? '/patient-profile' : 
                                   role === 'admin' ? '/admin/dashboard' : '/';
                  window.location.href = profileUrl;
                }}
                title={user?.firstName || "Profile"}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-white text-[#5f4191] flex items-center justify-center font-semibold"
              >
                {profile?.avatar || user?.avatar ? (
                  <Image
                    src={profile?.avatar || user?.avatar || '/icons/user-placeholder.png'}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  (user?.firstName || "U").charAt(0).toUpperCase()
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <a
                  href="/auth/login"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Login
                </a>
                <a
                  href="/auth"
                  className="bg-white hover:bg-white/90 text-[#5f4191] px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 18h16v-2H4v2zm0-5h16v-2H4v2zm0-7v2h16V6H4z"/>
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-xl z-[9999] overflow-hidden transform transition-all duration-300 ease-out ${
              isMenuOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              {isAuthenticated ? (
                <>
                  {/* User Info Section */}
                  <div className="bg-gradient-to-r from-[#5f4191] to-[#4d3374] text-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 text-white flex items-center justify-center font-semibold text-lg">
                        {profile?.avatar || user?.avatar ? (
                          <Image
                            src={profile?.avatar || user?.avatar || '/icons/user-placeholder.png'}
                            alt="Profile Picture"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          (user?.firstName || "U").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Hi, {user?.firstName || 'User'}!</p>
                        <p className="text-sm text-white/80 capitalize">{role || 'User'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        const profileUrl = role === 'doctor' ? '/doctor-profile' : 
                                         role === 'patient' ? '/patient-profile' : 
                                         role === 'admin' ? '/admin/dashboard' : '/';
                        window.location.href = profileUrl;
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-3"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Welcome Header */}
                  <div className="bg-gradient-to-r from-[#5f4191] to-[#4d3374] text-white p-4 text-center">
                    <h3 className="font-semibold text-lg">Welcome to Doctar</h3>
                    <p className="text-sm text-white/80">Join our healthcare community</p>
                  </div>

                  {/* Auth Buttons */}
                  <div className="p-4 space-y-3">
                    <a
                      href="/auth/login"
                      className="w-full p-3 bg-white border-2 border-[#5f4191] text-[#5f4191] rounded-lg font-medium hover:bg-[#5f4191] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v12z"/>
                      </svg>
                      Login
                    </a>
                    
                    <a
                      href="/auth"
                      className="w-full p-3 bg-[#5f4191] text-white rounded-lg font-medium hover:bg-[#4d3374] transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Sign Up
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Below Header */}
      <div className="md:hidden bg-[#5f4191] px-4 py-3">
        <SearchBar placeholder="Doctors" />
      </div>

      {/* Location Picker Modal */}
      <LocationPicker />
    </div>
  );
}
