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
import TrendingShortsSection from './components/TrendingShortsSection';
import TrendingVideosSection from './components/TrendingVideosSection';
import TrendingReelsSection from './components/TrendingReelsSection';
import TalkWithExpertSection from './components/TalkWithExpertSection';
import ReviewsSection from './components/ReviewsSection';
import Footer from './components/Footer';
import Image from 'next/image';
import HomeFAQ from './components/FAQ/HomeFaq';

export default function Home() {
  return (
    <div className="min-h-screen relative bg-white">   
    <div className="w-full h-[25vw] bg-[#5f4191] absolute"></div>
      <div className='lg:mx-35 relative z-10'>
      <HeroSection />
      <QuerySection />
      <DoctorsSection />
      <ConsultantSection />
      <WhyDoctorSection />
      {/* why choose doctor image */}
      <div>
      <div className="p-2 text-2xl">
        <h2 className="font-bold">
          
          Why choose <span className="font-extrabold">DOCTAR</span>?
        </h2>
        <div>
          <Image
            className="mt-2 h-[477px] w-full rounded-xl object-cover"
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
      <TrendingShortsSection />
      <TrendingVideosSection />
      <TalkWithExpertSection />
      
      <ReviewsSection />
    
      
      </div>
      <HomeFAQ/>
      <Footer />
    </div>
  );
}