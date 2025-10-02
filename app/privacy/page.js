import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Doctar</title>
        <meta name="description" content="Learn how we protect your privacy and handle your personal information at Doctar." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">Last updated: January 15, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                At Doctar, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Name, email address, and phone number</li>
                    <li>• Date of birth and gender</li>
                    <li>• Medical history and health information</li>
                    <li>• Payment and billing information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Device information and IP address</li>
                    <li>• Browser type and operating system</li>
                    <li>• Pages visited and time spent on our platform</li>
                    <li>• Search queries and appointment history</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="text-gray-600 space-y-3">
                <li>• To provide and improve our healthcare services</li>
                <li>• To connect you with healthcare providers</li>
                <li>• To process appointments and payments</li>
                <li>• To send important updates and notifications</li>
                <li>• To analyze usage patterns and improve our platform</li>
                <li>• To comply with legal and regulatory requirements</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• With healthcare providers for appointment purposes</li>
                <li>• With service providers who assist in our operations</li>
                <li>• When required by law or legal process</li>
                <li>• To protect our rights and the safety of our users</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, 
                secure servers, and regular security audits. However, no method of transmission over the internet 
                is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <ul className="text-gray-600 space-y-2">
                <li>• Access and review your personal information</li>
                <li>• Request corrections to inaccurate information</li>
                <li>• Request deletion of your account and data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Withdraw consent for data processing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on our website and updating the "Last updated" date.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-gray-600">
                <p>Email: privacy@doctar.in</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: Remote-First Company</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
