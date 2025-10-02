import Head from 'next/head';
import Link from 'next/link';

export default function PCITermsPage() {
  return (
    <>
      <Head>
        <title>PCI Terms & Conditions - Doctar</title>
        <meta name="description" content="Payment Card Industry terms and conditions for secure transactions on Doctar." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">PCI Terms & Conditions</h1>
            <p className="text-xl text-gray-600">Payment Card Industry compliance and security</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">PCI DSS Compliance</h2>
              <p className="text-gray-600 leading-relaxed">
                Doctar is committed to maintaining the highest standards of payment security. We are PCI DSS 
                (Payment Card Industry Data Security Standard) compliant, ensuring that your payment information 
                is protected according to industry standards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Security</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Encryption</h3>
                  <p className="text-gray-600">
                    All payment data is encrypted using industry-standard SSL/TLS encryption during transmission 
                    and AES-256 encryption for data at rest.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Processing</h3>
                  <p className="text-gray-600">
                    Payment processing is handled by PCI-compliant third-party providers with robust security 
                    measures and fraud detection systems.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tokenization</h3>
                  <p className="text-gray-600">
                    Sensitive payment information is tokenized to prevent unauthorized access and reduce 
                    the risk of data breaches.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We accept the following secure payment methods:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Credit cards (Visa, MasterCard, American Express, Discover)</li>
                <li>• Debit cards</li>
                <li>• Digital wallets (Apple Pay, Google Pay, PayPal)</li>
                <li>• Bank transfers (where available)</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fraud Prevention</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We employ multiple layers of fraud prevention to protect your transactions:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Real-time fraud detection and monitoring</li>
                <li>• Address verification and CVV validation</li>
                <li>• Machine learning algorithms for pattern recognition</li>
                <li>• 3D Secure authentication for additional verification</li>
                <li>• Regular security audits and penetration testing</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                Payment data is retained only as long as necessary for transaction processing and legal 
                compliance. We do not store full credit card numbers on our servers. All sensitive payment 
                information is securely handled by our PCI-compliant payment processors.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In case of payment disputes or unauthorized transactions:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Contact our support team immediately</li>
                <li>• We will investigate the matter within 24-48 hours</li>
                <li>• Refunds will be processed according to our refund policy</li>
                <li>• You may also contact your bank or credit card issuer</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To ensure secure transactions, please:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Keep your account credentials secure and confidential</li>
                <li>• Use strong, unique passwords for your account</li>
                <li>• Monitor your payment statements regularly</li>
                <li>• Report any suspicious activity immediately</li>
                <li>• Keep your contact information up to date</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed">
                We use trusted, PCI-compliant third-party payment processors to handle transactions. 
                These services are regularly audited and certified to meet the highest security standards. 
                We do not share your payment information with unauthorized parties.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                For payment-related questions or security concerns, please contact us:
              </p>
              <div className="text-gray-600">
                <p>Email: payments@doctar.in</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Security Team: security@doctar.in</p>
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
