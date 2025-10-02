import Head from 'next/head';
import Link from 'next/link';

export default function CareersPage() {
  const jobOpenings = [
    {
      id: 1,
      title: "Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build amazing healthcare experiences."
    },
    {
      id: 2,
      title: "Backend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Help us scale our platform to serve millions of users."
    },
    {
      id: 3,
      title: "Product Manager",
      location: "Hybrid",
      type: "Full-time",
      description: "Lead product development for our healthcare platform."
    },
    {
      id: 4,
      title: "UX Designer",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive healthcare experiences for patients and doctors."
    }
  ];

  return (
    <>
      <Head>
        <title>Careers - Doctar</title>
        <meta name="description" content="Join our team and help us revolutionize healthcare." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600">Help us build the future of healthcare</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work at Doctar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mission-Driven</h3>
                <p className="text-gray-600">Work on meaningful projects that improve healthcare access for everyone.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Work</h3>
                <p className="text-gray-600">Remote-first culture with flexible working hours.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                <p className="text-gray-600">Continuous learning and career development opportunities.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Benefits</h3>
                <p className="text-gray-600">Competitive salary, health insurance, and more.</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Open Positions</h2>
            <div className="space-y-4">
              {jobOpenings.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-3">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <button className="ml-4 px-4 py-2 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Don't See Your Role?</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our team. Send us your resume and 
              let us know how you'd like to contribute to our mission.
            </p>
            <button className="px-6 py-3 bg-[#5f4191] text-white rounded-lg hover:bg-[#4d3374] transition-colors">
              Send Resume
            </button>
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
