'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on authentication routes
  const hideHeaderRoutes = [
    '/auth',
    '/auth/login',
    '/auth/signup',
    '/auth/patient-onboarding',
    '/auth/doctor-signup',
    '/auth/forgot-password',
    '/auth/success',
    '/doctor-profile',
  ];
  
  // Check if current path starts with any of the hide routes
  const shouldHideHeader = hideHeaderRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Don't render header if it should be hidden
  if (shouldHideHeader) {
    return null;
  }
  
  return <Header />;
}
