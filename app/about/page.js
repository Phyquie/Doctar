import Head from 'next/head';
import Link from 'next/link';
import AboutUsDesktop from '../components/aboutUs/aboutUsDesktop';
import {teamData }from '../components/aboutUs/aboutData';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us - Doctar</title>
        <meta name="description" content="Learn about Doctar's mission to connect patients with the best healthcare providers." />
      </Head>
      <div className="min-h-screen bg-gray-200 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">About Doctar</h1>
            <p className="text-lg sm:text-xl text-gray-600">Connecting patients with the best healthcare providers</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At Doctar, we believe that quality healthcare should be accessible to everyone. Our platform connects patients 
                with verified healthcare providers, making it easier to find the right doctor, book appointments, and access 
                quality medical care.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">What We Do</h2>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="text-[#5f4191] mr-3">•</span>
                  <span>Connect patients with verified doctors and specialists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5f4191] mr-3">•</span>
                  <span>Provide comprehensive doctor profiles with reviews and ratings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5f4191] mr-3">•</span>
                  <span>Enable easy appointment booking and scheduling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5f4191] mr-3">•</span>
                  <span>Offer location-based doctor search and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#5f4191] mr-3">•</span>
                  <span>Maintain a trusted healthcare directory</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To become the leading healthcare platform that bridges the gap between patients and healthcare providers, 
                ensuring that everyone has access to quality medical care when they need it most.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Why Choose Doctar?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Doctors</h3>
                  <p className="text-gray-600">All doctors on our platform are verified and licensed professionals.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Search</h3>
                  <p className="text-gray-600">Find doctors by location, specialization, and availability.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Reviews</h3>
                  <p className="text-gray-600">Read authentic reviews from other patients to make informed decisions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                  <p className="text-gray-600">Our support team is always here to help you.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/doctors" 
              className="inline-flex items-center px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Find a Doctor
            </Link>
          </div>
          <AboutUsDesktop teamData={teamData} />
        </div>
      </div>
    </>
  );
}
