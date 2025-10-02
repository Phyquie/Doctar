import React, { useState } from 'react';

const SimpleFAQ = ({ faqs, title = "Frequently Asked Questions", className = "" }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={className.includes('bg-transparent') ? `rounded-lg shadow-sm ${className}` : `bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 ${className.includes('bg-transparent') ? 'text-white' : 'text-gray-900'}`}>{title}</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={className.includes('border-none') ? "rounded-lg overflow-hidden" : className.includes('bg-transparent') ? "rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200" : "border border-gray-200 rounded-lg overflow-hidden"}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={className.includes('bg-transparent') ?
                  "w-full px-6 py-4 text-left bg-transparent hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-200 text-white" :
                  "w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
                }
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium pr-4 ${className.includes('bg-transparent') ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </h3>
                  <svg
                    className={`flex-shrink-0 w-5 h-5 transform transition-transform duration-200 ${
                      className.includes('bg-transparent') ? 'text-white' : 'text-gray-500'
                    } ${activeIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {activeIndex === index && (
                <div className={className.includes('bg-transparent') ?
                  "px-6 py-4 bg-white/5 border-t border-white/20" :
                  "px-6 py-4 bg-white border-t border-gray-200"
                }>
                  <p className={`leading-relaxed ${className.includes('bg-transparent') ? 'text-white/90' : 'text-gray-700'}`}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleFAQ;
