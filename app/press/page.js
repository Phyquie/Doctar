import Head from 'next/head';
import Link from 'next/link';

export default function PressPage() {
  const pressReleases = [
    {
      id: 1,
      title: "Doctar Launches New Telemedicine Features",
      date: "2025-01-15",
      summary: "Platform introduces video consultations and remote monitoring capabilities."
    },
    {
      id: 2,
      title: "Doctar Partners with Major Healthcare Networks",
      date: "2025-01-10",
      summary: "Expanding access to quality healthcare across multiple regions."
    },
    {
      id: 3,
      title: "Doctar Receives Healthcare Innovation Award",
      date: "2025-01-05",
      summary: "Recognized for outstanding contribution to healthcare accessibility."
    }
  ];

  const mediaKit = {
    logo: "/icons/logo.png",
    brandColors: {
      primary: "#5f4191",
      secondary: "#4d3374"
    },
    pressContact: {
      name: "Press Team",
      email: "press@doctar.in",
      phone: "+1 (555) 123-4567"
    }
  };

  return (
    <>
      <Head>
        <title>Press - Doctar</title>
        <meta name="description" content="Latest news, press releases, and media resources from Doctar." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Center</h1>
            <p className="text-xl text-gray-600">Latest news and media resources</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map((release) => (
                <div key={release.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                      <p className="text-gray-600 mb-3">{release.summary}</p>
                      <span className="text-sm text-gray-500">{release.date}</span>
                    </div>
                    <button className="ml-4 px-4 py-2 text-[#5f4191] border border-[#5f4191] rounded-lg hover:bg-[#5f4191] hover:text-white transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Media Kit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Assets</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Logo (PNG)</span>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Logo (SVG)</span>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Brand Guidelines</span>
                    <button className="text-[#5f4191] hover:text-[#4d3374] text-sm font-medium">
                      Download
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Press Contact</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">{mediaKit.pressContact.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{mediaKit.pressContact.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{mediaKit.pressContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Founded</h3>
                <p className="text-gray-600">2024</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Headquarters</h3>
                <p className="text-gray-600">Remote-First Company</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry</h3>
                <p className="text-gray-600">Healthcare Technology</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission</h3>
                <p className="text-gray-600">Connecting patients with quality healthcare</p>
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
