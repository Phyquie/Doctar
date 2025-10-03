'use client';

import HeroSection from './components/HeroSection';
import QuerySection from './components/QuerySection';
import DoctorsSection from './components/DoctorsSection';
import ConsultantSection from './components/ConsultantSection';
import WhyDoctorSection from './components/WhyDoctorSection';
import ComparisonSection from './components/ComparisonSection';
import HowItWorksSection from './components/HowItWorksSection';
import VisionMissionSection from './components/VisionMissionSection';
import NewsGuideSection from './components/NewsGuideSection';
import BlogSection from './components/BlogSection';
import TrendingVideosSection from './components/TrendingVideosSection';
import TrendingReelsSection from './components/TrendingReelsSection';
import TalkWithExpertSection from './components/TalkWithExpertSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import Image from 'next/image';
import HomeFAQ from './components/FAQ/HomeFaq';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Purple Header Background - Full Width */}
      <div className="bg-[#5f4191] w-full h-32 md:h-[15vw]"></div>

      {/* Main Content Container with responsive width */}
      <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto">
        {/* Banner Section - Overlapping the split */}
        <div className="px-2 sm:px-4 -mt-16 md:-mt-[12vw] z-10">
          <HeroSection />
        </div>

        <div className="mt-4 px-2 sm:px-0 my-10">
          <QuerySection />
        </div>

        <div className="mt-4 px-2 sm:px-0 mb-10">
          <DoctorsSection />
        </div>

        <ConsultantSection />
        <WhyDoctorSection />
        
        {/* why choose doctor image */}
        <div className="px-2 sm:px-4">
          <div className="p-2 sm:p-4 text-xl sm:text-2xl">
            <h2 className="font-bold text-center sm:text-left">
              Why choose <span className="font-extrabold">DOCTAR</span>?
            </h2>
            <div className="mt-4">
              <Image
                className="mt-2 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[477px] w-full rounded-xl object-cover"
                src="/icons/docphoto.webp"
                alt="Doctor"
                width={1200}
                height={477}
                priority
                unoptimized
                onError={(e) => {
                  console.log('Failed to load docphoto.webp');
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
        
        <ComparisonSection />
        <HowItWorksSection />
        <VisionMissionSection />
        <NewsGuideSection />
        <BlogSection />
        <TrendingReelsSection />
        <TrendingVideosSection />
        <TalkWithExpertSection />
        
        {/* Reviews Section - Responsive Layout with proper spacing */}
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8 md:mt-12 lg:mt-16">
          <ReviewsSection />
        </div>
      </div>

      {/* FAQ Section - New style for all devices */}
      <div className="mt-20">
        <HomeFAQ />
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}