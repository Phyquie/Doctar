import Head from 'next/head';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I find a doctor?",
      answer: "Use our search feature to find doctors by location, specialization, or name. You can also browse by categories on our homepage."
    },
    {
      question: "How do I book an appointment?",
      answer: "Once you find a doctor, click on their profile and select 'Book Appointment'. Choose your preferred date and time from their available slots."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule appointments up to 24 hours in advance through your account dashboard."
    },
    {
      question: "How do I create an account?",
      answer: "Click on 'Sign Up' in the top right corner, choose whether you're a patient or doctor, and follow the registration process."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption and follow strict privacy protocols to protect your personal and medical information."
    },
    {
      question: "How do I leave a review for a doctor?",
      answer: "After your appointment, you can leave a review by visiting the doctor's profile and clicking on the 'Write Review' button."
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Learn how to use Doctar effectively",
      icon: "🚀"
    },
    {
      title: "Account Management",
      description: "Manage your profile and settings",
      icon: "👤"
    },
    {
      title: "Appointments",
      description: "Booking and managing appointments",
      icon: "📅"
    },
    {
      title: "Billing & Payments",
      description: "Payment methods and billing questions",
      icon: "💳"
    },
    {
      title: "Technical Support",
      description: "Troubleshooting and technical issues",
      icon: "🔧"
    },
    {
      title: "Privacy & Security",
      description: "Data protection and security measures",
      icon: "🔒"
    }
  ];

  return (
    <>
      <Head>
        <title>Help Center - Doctar</title>
        <meta name="description" content="Get help with using Doctar. Find answers to common questions and learn how to use our platform." />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600">Find answers to your questions and learn how to use Doctar</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5f4191] focus:border-transparent"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-[#5f4191] rounded-lg p-8 text-white mt-12">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
              <p className="text-lg mb-6">Our support team is here to help you 24/7</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="px-6 py-3 bg-white text-[#5f4191] rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Contact Support
                </Link>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#5f4191] transition-colors font-medium">
                  Live Chat
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
