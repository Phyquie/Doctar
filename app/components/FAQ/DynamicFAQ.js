import React, { useState, useMemo } from 'react';
import { faqCategories, generateLocationFAQ, generateSpecialtyFAQ } from '../../../public/icons/faqData/faqData'

const DynamicFAQ = ({
  categories = ['general', 'patients'],
  location = null,
  specialty = null,
  searchContext = null,
  searchTerm: propSearchTerm = null,
  maxItems = 10,
  className = ""
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Extract searchTerm from props or searchContext
  const searchTerm = propSearchTerm || (searchContext?.searchTerm) || '';

  // Generate FAQs based on search context
  const generateSearchContextFAQs = (context) => {
    const { searchTerm, hasResults, isDoctorName, isSpecialty } = context;
    const faqs = [];

    if (!hasResults && searchTerm) {
      if (isDoctorName) {
        faqs.push({
          id: 'no_doctor_results_help',
          question: `Why can't I find Dr. ${searchTerm}?`,
          answer: `The doctor might not be listed on our platform yet, might practice under a different name, or might be in a different location. Try searching by specialty or location instead, or contact us to add the doctor to our platform.`,
          keywords: ['no results', 'doctor name', 'not found', searchTerm.toLowerCase()]
        });
      } else if (isSpecialty) {
        faqs.push({
          id: 'no_specialty_results_help',
          question: `Why can't I find ${searchTerm} specialists?`,
          answer: `There might not be ${searchTerm} specialists available in your selected area, or they might be listed under a different specialty name. Try expanding your search area or using related specialty terms.`,
          keywords: ['no results', 'specialty', 'specialists', searchTerm.toLowerCase()]
        });
      } else {
        faqs.push({
          id: 'no_results_help',
          question: `Why can't I find doctors for "${searchTerm}"?`,
          answer: `There might be several reasons: the search term might be too specific, there might not be doctors with that exact specialty in your area, or you might want to try different keywords. Try searching for broader terms or check the spelling.`,
          keywords: ['no results', 'search help', searchTerm.toLowerCase()]
        });
      }
    }

    if (hasResults && searchTerm) {
      if (isDoctorName) {
        faqs.push({
          id: 'doctor_booking_help',
          question: `How do I book an appointment with doctors like ${searchTerm}?`,
          answer: `Click on any doctor's profile to view their details, available time slots, and contact information. You can then book appointments directly through phone, WhatsApp, email, or their preferred booking method.`,
          keywords: ['booking', 'appointment', 'doctor name', searchTerm.toLowerCase()]
        });
        faqs.push({
          id: 'doctor_profile_help',
          question: `How do I verify a doctor's credentials?`,
          answer: `All doctors on Doctar are verified. You can view their qualifications, experience, patient reviews, and ratings on their profile page to make an informed decision.`,
          keywords: ['verification', 'credentials', 'doctor profile', 'trust']
        });
      } else if (isSpecialty) {
        faqs.push({
          id: 'specialty_booking_help',
          question: `How do I book an appointment with ${searchTerm} specialists?`,
          answer: `Browse through the ${searchTerm} specialists in your area, compare their profiles, experience, and patient reviews. Click on your preferred doctor to book an appointment directly.`,
          keywords: ['booking', 'appointment', 'specialists', searchTerm.toLowerCase()]
        });
        faqs.push({
          id: 'specialty_consultation_help',
          question: `What should I expect during a ${searchTerm} consultation?`,
          answer: `During your consultation, the ${searchTerm} will review your medical history, perform relevant examinations, discuss your symptoms, and provide diagnosis and treatment recommendations. Come prepared with your medical records and questions.`,
          keywords: ['consultation', 'what to expect', searchTerm.toLowerCase()]
        });
      } else {
        faqs.push({
          id: 'booking_help',
          question: `How do I book an appointment with these doctors?`,
          answer: `You can book appointments directly through doctor profiles. Click on any doctor card to view their profile, check availability, and book appointments via phone, email, or their preferred booking method.`,
          keywords: ['booking', 'appointment', searchTerm.toLowerCase()]
        });
      }
    }

    return faqs;
  };

  // Calculate FAQ relevance score
  const calculateFAQRelevance = (faq, searchContext, location, specialty) => {
    if (!faq) return 0;
    
    let score = 0;
    
    // Base score
    score += 1;
    
    // Boost for search context matches
    if (searchContext && Array.isArray(faq.keywords)) {
      const { searchTerm } = searchContext;
      if (searchTerm && typeof searchTerm === 'string') {
        const hasMatch = faq.keywords.some(keyword => {
          if (typeof keyword !== 'string') return false;
          return keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 searchTerm.toLowerCase().includes(keyword.toLowerCase());
        });
        if (hasMatch) score += 10;
      }
    }
    
    // Boost for location matches
    if (location && typeof location === 'string' && Array.isArray(faq.keywords)) {
      const hasLocationMatch = faq.keywords.some(keyword => {
        if (typeof keyword !== 'string') return false;
        return keyword.toLowerCase().includes(location.toLowerCase());
      });
      if (hasLocationMatch) score += 8;
    }
    
    // Boost for specialty matches
    if (specialty && typeof specialty === 'string' && Array.isArray(faq.keywords)) {
      const hasSpecialtyMatch = faq.keywords.some(keyword => {
        if (typeof keyword !== 'string') return false;
        return keyword.toLowerCase().includes(specialty.toLowerCase());
      });
      if (hasSpecialtyMatch) score += 8;
    }
    
    // Boost for search context generated FAQs
    if (faq.id && typeof faq.id === 'string') {
      if (faq.id.includes('no_results') || faq.id.includes('booking') || faq.id.includes('specialty') || faq.id.includes('doctor_')) {
        score += 15;
      }
    }
    
    return score;
  };

  // Generate dynamic FAQs based on location, specialty, and search context
  const dynamicFAQs = useMemo(() => {
    let faqs = [];
    
    // Add category-based FAQs
    categories.forEach(category => {
      if (faqCategories[category]) {
        faqs.push(...faqCategories[category].faqs);
      }
    });

    // Add search context specific FAQs
    if (searchContext) {
      faqs.push(...generateSearchContextFAQs(searchContext));
    }

    // Add location-specific FAQs
    if (location) {
      const locationFAQs = generateLocationFAQ(location);
      faqs.push(...locationFAQs.map((faq, index) => ({
        id: `location_${index}`,
        ...faq
      })));
    }

    // Add specialty-specific FAQs
    if (specialty) {
      const specialtyFAQs = generateSpecialtyFAQ(specialty);
      faqs.push(...specialtyFAQs.map((faq, index) => ({
        id: `specialty_${index}`,
        ...faq
      })));
    }

    // Sort FAQs by relevance (prioritize search context and location)
    return faqs.sort((a, b) => {
      try {
        const aRelevance = calculateFAQRelevance(a, searchContext, location, specialty);
        const bRelevance = calculateFAQRelevance(b, searchContext, location, specialty);
        return bRelevance - aRelevance;
      } catch (error) {
        console.warn('Error calculating FAQ relevance:', error);
        return 0; // Keep original order if error occurs
      }
    });
  }, [categories, location, specialty, searchContext]);

  // Filter FAQs based on search term
  const filteredFAQs = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') return dynamicFAQs.slice(0, maxItems);

    return dynamicFAQs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, maxItems);
  }, [dynamicFAQs, searchTerm, maxItems]);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  if (filteredFAQs.length === 0) return null;

  return (
    <div className={className && className.includes('bg-transparent') ? `${className}` : `${className || 'bg-white rounded-lg shadow-sm'}`}>
            {/* FAQ List */}
      <div className={className ? "p-0" : "p-6"}>
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={faq.id || index} 
              className={className && className.includes('border-none') ? "rounded-lg overflow-hidden" : className ? "rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200" : "border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={className ? "w-full px-6 py-4 text-left bg-transparent hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-200 text-white" : "w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium pr-4 ${className ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </h3>
                  <svg
                    className={`flex-shrink-0 w-5 h-5 transform transition-transform duration-200 ${
                      className ? 'text-white' : 'text-gray-500'
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
                <div className={`px-6 py-4 ${className ? 'bg-white/5 border-t border-white/20' : 'bg-white border-t border-gray-200'}`}>
                  <p className={`leading-relaxed ${className ? 'text-white/90' : 'text-gray-700'}`}>
                    {faq.answer}
                  </p>
                  {faq.keywords && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.keywords.slice(0, 3).map((keyword, keyIndex) => (
                        <span 
                          key={keyIndex}
                          className={`px-2 py-1 text-xs rounded-full ${
                            className
                              ? 'bg-white/20 text-white/90'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        

        {/* No results message */}
        {searchTerm && filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className={className ? 'text-white/70' : 'text-gray-600'}>
              No FAQs found for "{searchTerm}". Try a different search term.
            </p>
          </div>
        )}
      </div>

      {/* Schema.org structured data for SEO */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": filteredFAQs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </div>
  );
};

export default DynamicFAQ;
