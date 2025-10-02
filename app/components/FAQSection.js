'use client';

import { useState } from 'react';

const FAQSection = ({ doctorName = 'the doctor', consultationFee = '500' }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: `What are Dr. ${doctorName}'s consultation fees?`,
      answer: `Dr. ${doctorName}'s consultation fee is ₹${consultationFee} per session. This includes a comprehensive consultation, diagnosis, and treatment plan. Payment can be made via cash, card, or digital payment methods.`
    },
    {
      id: 2,
      question: 'What are the clinic timings?',
      answer: 'Our clinic is open Monday to Saturday from 9:00 AM to 6:00 PM. Sunday consultations are available by prior appointment only. Emergency consultations can be arranged outside regular hours.'
    },
    {
      id: 3,
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by calling us at +91 68753 4234, sending a WhatsApp message, or using our online booking system. We recommend booking at least 24 hours in advance to secure your preferred time slot.'
    },
    {
      id: 4,
      question: 'What should I bring to my first appointment?',
      answer: 'Please bring your ID proof, previous medical records, current medications list, and any relevant test reports. If you have insurance, bring your insurance card. Arrive 15 minutes early to complete the registration process.'
    },
    {
      id: 5,
      question: `Does Dr. ${doctorName} offer online consultations?`,
      answer: `Yes, Dr. ${doctorName} offers online video consultations for follow-up visits and non-emergency consultations. Online consultation fees are the same as in-person visits. Please book online consultations through our website or app.`
    },
    {
      id: 6,
      question: 'What is the cancellation policy?',
      answer: 'Appointments can be cancelled or rescheduled up to 2 hours before the scheduled time without any charges. Cancellations made less than 2 hours before the appointment may incur a cancellation fee of ₹100.'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAQ Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Common questions about Dr. {doctorName}</p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <button 
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
              >
                <span className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</span>
                <div className={`w-8 h-8 bg-[#5f4191] rounded-full flex items-center justify-center transition-transform flex-shrink-0 ${activeFaq === faq.id ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {activeFaq === faq.id && (
                <div className="px-6 pb-5 border-t border-gray-100">
                  <p className="text-gray-600 pt-4 leading-relaxed">
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

export default FAQSection;