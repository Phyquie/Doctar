import Head from 'next/head';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions - Doctar</title>
        <meta name="description" content="Read our terms and conditions for using the Doctar platform." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-xl text-gray-600">Last updated: January 15, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using the Doctar platform, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Permission is granted to temporarily use Doctar for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on the website</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, 
                and current at all times. You are responsible for:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Maintaining the confidentiality of your account and password</li>
                <li>• All activities that occur under your account</li>
                <li>• Notifying us immediately of any unauthorized use of your account</li>
                <li>• Ensuring your account information remains accurate and up-to-date</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Healthcare Services</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Doctar is a platform that connects patients with healthcare providers. We do not provide medical advice, 
                diagnosis, or treatment. Important disclaimers:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• We are not a healthcare provider and do not provide medical services</li>
                <li>• All healthcare services are provided by licensed professionals</li>
                <li>• We do not guarantee the availability or quality of healthcare services</li>
                <li>• Users are responsible for verifying the credentials of healthcare providers</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You may not use our platform for any unlawful purpose or to solicit others to perform unlawful acts. 
                Prohibited activities include:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Violating any laws or regulations</li>
                <li>• Transmitting harmful or malicious code</li>
                <li>• Attempting to gain unauthorized access to our systems</li>
                <li>• Interfering with the proper functioning of the platform</li>
                <li>• Harassing or threatening other users</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Payment for healthcare services is processed through our secure payment system. Terms include:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• All payments are processed securely and encrypted</li>
                <li>• Refunds are subject to the healthcare provider's cancellation policy</li>
                <li>• We may charge service fees for platform usage</li>
                <li>• Payment disputes should be resolved directly with the healthcare provider</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall Doctar, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use 
                of the platform.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your account and bar access to the platform immediately, without prior 
                notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                including but not limited to a breach of the Terms.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="text-gray-600">
                <p>Email: legal@doctar.in</p>
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
