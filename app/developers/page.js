import Head from 'next/head';
import Link from 'next/link';

export default function DevelopersPage() {
  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/doctors",
      description: "Get list of doctors with pagination and filters"
    },
    {
      method: "GET",
      endpoint: "/api/doctors/{id}",
      description: "Get specific doctor details"
    },
    {
      method: "GET",
      endpoint: "/api/doctors/{id}/reviews",
      description: "Get doctor reviews"
    },
    {
      method: "POST",
      endpoint: "/api/reviews",
      description: "Submit a new review"
    }
  ];

  const sdkFeatures = [
    "Easy integration with your existing applications",
    "Comprehensive documentation and examples",
    "TypeScript support for better development experience",
    "Built-in error handling and retry logic",
    "Rate limiting and authentication helpers"
  ];

  return (
    <>
      <Head>
        <title>Developer Resources - Doctar</title>
        <meta name="description" content="Access our API documentation, SDKs, and developer resources to integrate with Doctar." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Developer Resources</h1>
            <p className="text-xl text-gray-600">Build amazing healthcare applications with our API</p>
          </div>

          {/* API Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Overview</h2>
            <p className="text-gray-600 mb-6">
              Our RESTful API allows you to integrate Doctar's healthcare data and functionality 
              into your applications. Access doctor information, reviews, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Base URL</h3>
                <code className="bg-gray-100 px-3 py-2 rounded text-sm">https://api.doctar.in/v1</code>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication</h3>
                <p className="text-gray-600 text-sm">API Key required for all requests</p>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Endpoints</h2>
            <div className="space-y-4">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                  </div>
                  <p className="text-gray-600 text-sm">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SDKs */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Software Development Kits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">JavaScript SDK</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4">
                  <code className="text-sm">
                    npm install @doctar/sdk
                  </code>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {sdkFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#5f4191] mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Python SDK</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg mb-4">
                  <code className="text-sm">
                    pip install doctar-sdk
                  </code>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {sdkFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#5f4191] mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documentation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
                <p className="text-gray-600 text-sm mb-4">Complete API documentation with examples</p>
                <button className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors text-sm">
                  View Docs
                </button>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
                <p className="text-gray-600 text-sm mb-4">Get up and running in minutes</p>
                <button className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors text-sm">
                  Get Started
                </button>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Examples</h3>
                <p className="text-gray-600 text-sm mb-4">Code samples and tutorials</p>
                <button className="px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors text-sm">
                  View Examples
                </button>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-[#5f4191] rounded-lg p-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Developer Support</h2>
              <p className="text-lg mb-6">Need help integrating? Our developer team is here to assist you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="px-6 py-3 bg-white text-[#5f4191] rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Contact Developers
                </Link>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#5f4191] transition-colors font-medium">
                  Join Discord
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
