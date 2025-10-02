import { useState } from "react";
import { FaSearch, FaUserMd, FaHeart, FaShieldAlt } from "react-icons/fa";

const HowItWorksSection = () => {
  const [activeTab, setActiveTab] = useState("buy");

  const patientSteps = [
    {
      id: 1,
      title: "Find Your Doctor",
      description:
        "Browse and search for qualified doctors by specialty, location, and expertise. View complete profiles with qualifications and patient reviews.",
      icon: FaSearch,
      iconColor: "#7551B2",
    },
    {
      id: 2,
      title: "Connect Instantly",
      description:
        "Get direct contact with doctors through phone, WhatsApp, email, or book clinic appointments online without any middleman delays.",
      icon: FaUserMd,
      iconColor: "#10B981",
    },
    {
      id: 3,
      title: "Get Treatment",
      description:
        "Consult with verified doctors, receive quality healthcare, and build lasting relationships with trusted medical professionals near you.",
      icon: FaHeart,
      iconColor: "#EF4444",
    },
  ];

  const doctorSteps = [
    {
      id: 1,
      title: "Create Your Profile",
      description:
        "Register and create a comprehensive profile with your qualifications, specializations, experience, and clinic information to attract patients.",
      icon: FaUserMd,
      iconColor: "#7551B2",
    },
    {
      id: 2,
      title: "Get Verified",
      description:
        "Complete our verification process to earn the trusted badge. Upload your medical license and credentials for patient confidence.",
      icon: FaShieldAlt,
      iconColor: "#F59E0B",
    },
    {
      id: 3,
      title: "Start Consulting",
      description:
        "Begin receiving patient inquiries, accept appointments, and provide quality healthcare services with zero commission charges.",
      icon: FaHeart,
      iconColor: "#EF4444",
    },
  ];

  const steps = activeTab === "buy" ? patientSteps : doctorSteps;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4 sm:mb-6">How it works ?</h2>

      {/* Combined Buy/Sell Tab in single pill */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="bg-gray-200 rounded-full p-1 shadow-lg flex">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === "buy"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            For Patients
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeTab === "sell"
                ? "bg-black text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            For Doctors
          </button>
        </div>
      </div>

      {/* Steps - Mobile: Horizontal scroll, Desktop: Flexible grid layout */}
      <div className="flex overflow-x-auto gap-4 pb-4 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-6 2xl:gap-8 lg:overflow-visible">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-[#F2F1F9] p-4 pt-15 rounded-xl flex-shrink-0 text-center relative w-[232px] h-[316px] lg:w-full lg:max-w-[360px] lg:h-auto lg:min-h-[300px] lg:max-h-[406px] lg:flex-shrink"
          >
            {/* Step number in top right corner with white rounded background */}
            <div className="absolute top-0 right-0 w-16 h-16 lg:w-16 xl:w-20 lg:h-16 xl:h-20 bg-white rounded-bl-full flex items-center justify-center">
              <span className="text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-700">
                {step.id}
              </span>
            </div>
            
            <div className="flex justify-start mb-6">
              <div className="bg-white rounded-full p-3 lg:p-3 xl:p-4 shadow-sm">
                <step.icon
                  className="w-8 h-8 lg:w-8 xl:w-10 lg:h-8 xl:h-10"
                  style={{ color: step.iconColor }}
                />
              </div>
            </div>
            <h3 className="font-semibold text-left text-lg lg:text-lg xl:text-xl text-gray-700 mb-2">
              {step.title}
            </h3>
            <p className="text-sm lg:text-sm xl:text-base text-left text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Custom scrollbar styles for mobile */}
      <style>
        {`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
          .overflow-x-auto {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* Internet Explorer 10+ */
          }
        `}
      </style>
    </div>
  );
};

export default HowItWorksSection;


