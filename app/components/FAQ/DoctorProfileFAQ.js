import React from 'react';
import SimpleFAQ from './SimpleFAQ';

// Generate dynamic FAQs for doctor profiles
const generateDoctorFAQs = (doctor) => {
  const {
    name,
    specialty = "General Medicine",
    address = {},
    consultationFee,
    languages = ["Hindi", "English"],
    keySpecialization = [],
    about = ""
  } = doctor;

  // Extract doctor name from multiple possible sources
  const doctorName = name || doctor.user?.name || doctor.fullName || 
                    (doctor.firstName && doctor.lastName ? `${doctor.firstName} ${doctor.lastName}` : null) || 
                    doctor.firstName || doctor.lastName || "Doctor";

  const location = address?.city || address?.state || "your area";
  const specialtyLower = specialty.toLowerCase();
  const doctorTitle = getDoctorTitle(specialty);
  const services = getServicesForSpecialty(specialty);
  const emergencyServices = getEmergencyServices(specialty);
  const cosmetic = getCosmeticServices(specialty);

  return [
    {
      question: `Who is Dr. ${doctorName}?`,
      answer: `Dr. ${doctorName} is a trusted ${specialtyLower} ${about ? about : `specializing in comprehensive ${specialtyLower} care. ${doctorTitle} provides complete healthcare solutions for patients of all age groups with modern treatment approaches.`}`
    },
    {
      question: `What ${specialtyLower} services does Dr. ${doctorName} provide?`,
      answer: `Dr. ${doctorName} offers a wide range of ${specialtyLower} services including:\n\n${services.join('\n')}\n\nAll treatments are provided with modern equipment and personalized care.`
    },
    {
      question: `How can I book an appointment with Dr. ${doctorName}?`,
      answer: `You can easily book an appointment with Dr. ${doctorName} by calling directly, connecting on WhatsApp, sending an email, or visiting the clinic through the Doctar platform. Online booking is available for your convenience.`
    },
    {
      question: `Does Dr. ${doctorName} treat children?`,
      answer: getChildrenTreatmentAnswer(specialty, doctorName)
    },
    {
      question: `Where is Dr. ${doctorName}'s clinic located?`,
      answer: `Dr. ${doctorName} practices in ${location}, making it easily accessible for patients in the area. You can find the exact clinic address and directions on the Doctar platform.`
    },
    {
      question: `What languages does Dr. ${doctorName} speak?`,
      answer: `Dr. ${doctorName} communicates fluently in ${languages.join(', ')}, ensuring comfort and clear communication for all patients during consultations.`
    },
    {
      question: `Does Dr. ${doctorName} offer emergency ${specialtyLower} care?`,
      answer: `Yes, Dr. ${doctorName} attends to ${specialtyLower} emergencies including ${emergencyServices.join(', ')}. Contact directly for urgent medical situations.`
    },
    {
      question: `What makes Dr. ${doctorName} a recommended ${specialtyLower}?`,
      answer: `Patients trust Dr. ${doctorName} for ${getRecommendationReasons(specialty, keySpecialization)}. ${doctorTitle} is known for patient-focused care and modern treatment approaches.`
    },
    {
      question: `Can I consult Dr. ${doctorName} online?`,
      answer: `Yes, you can connect with Dr. ${doctorName} online for initial consultation and medical advice via phone or video call before visiting the clinic. Online consultations are available for follow-ups and general queries.`
    },
    {
      question: cosmetic ? `Does Dr. ${doctorName} provide ${cosmetic.type}?` : `What specialized treatments does Dr. ${doctorName} offer?`,
      answer: cosmetic ? `Absolutely. Dr. ${doctorName} specializes in ${cosmetic.services.join(', ')}. ${doctorTitle} uses modern techniques for the best results.` : `Dr. ${doctorName} offers specialized ${specialtyLower} treatments including ${keySpecialization.join(', ')} with advanced medical techniques and personalized care plans.`
    },
    {
      question: `How much does treatment cost with Dr. ${doctorName}?`,
      answer: `${consultationFee ? `Consultation fee starts from ₹${consultationFee}.` : 'Consultation fees are affordable and transparent.'} Treatment costs depend on the specific procedure. Dr. ${doctorName} ensures transparent pricing for all ${specialtyLower} services with no hidden charges.`
    },
    {
      question: `How do I reach Dr. ${doctorName} for medical advice?`,
      answer: `You can contact Dr. ${doctorName} directly through the Doctar website, call, or WhatsApp for quick medical advice and appointments. ${doctorTitle} is readily available for patient queries and emergency consultations.`
    }
  ];
};

// Helper functions for different specialties
const getDoctorTitle = (specialty) => {
  const titles = {
    'dentist': 'He',
    'dental': 'He',
    'cardiology': 'The cardiologist',
    'pediatrics': 'The pediatrician', 
    'gynecology': 'The gynecologist',
    'orthopedics': 'The orthopedic specialist',
    'dermatology': 'The dermatologist',
    'neurology': 'The neurologist',
    'psychiatry': 'The psychiatrist',
    'oncology': 'The oncologist'
  };
  
  const key = Object.keys(titles).find(k => specialty.toLowerCase().includes(k));
  return titles[key] || 'The doctor';
};

const getServicesForSpecialty = (specialty) => {
  const services = {
    'dentist': [
      '• Dental check-ups & cleanings',
      '• Tooth extraction & fillings', 
      '• Root canal treatment (RCT)',
      '• Crowns, bridges & dentures',
      '• Braces & aligners',
      '• Teeth whitening & smile makeover',
      '• Gum care & oral surgery'
    ],
    'dental': [
      '• Dental check-ups & cleanings',
      '• Tooth extraction & fillings', 
      '• Root canal treatment (RCT)',
      '• Crowns, bridges & dentures',
      '• Braces & aligners',
      '• Teeth whitening & smile makeover',
      '• Gum care & oral surgery'
    ],
    'cardiology': [
      '• Heart health check-ups',
      '• ECG & Echo tests',
      '• Blood pressure management', 
      '• Cholesterol treatment',
      '• Heart disease prevention',
      '• Cardiac rehabilitation',
      '• Chest pain evaluation'
    ],
    'pediatrics': [
      '• Child health check-ups',
      '• Vaccination & immunization',
      '• Growth monitoring',
      '• Fever & infection treatment',
      '• Nutritional guidance',
      '• Developmental assessments',
      '• Newborn care'
    ],
    'gynecology': [
      '• Women\'s health check-ups',
      '• Pregnancy care & delivery',
      '• Menstrual disorders',
      '• Family planning',
      '• Infertility treatment',
      '• Menopause management',
      '• Gynecological surgeries'
    ],
    'orthopedics': [
      '• Bone & joint problems',
      '• Fracture treatment',
      '• Sports injuries',
      '• Arthritis management',
      '• Spine disorders',
      '• Joint replacement',
      '• Physical therapy guidance'
    ]
  };
  
  const key = Object.keys(services).find(k => specialty.toLowerCase().includes(k));
  return services[key] || [
    '• Comprehensive medical consultations',
    '• Diagnosis & treatment',
    '• Preventive healthcare',
    '• Health screenings',
    '• Medication management',
    '• Follow-up care',
    '• Emergency medical care'
  ];
};

const getEmergencyServices = (specialty) => {
  const emergency = {
    'dentist': ['severe toothache', 'broken teeth', 'bleeding gums', 'dental trauma'],
    'dental': ['severe toothache', 'broken teeth', 'bleeding gums', 'dental trauma'],
    'cardiology': ['chest pain', 'heart palpitations', 'breathing difficulties', 'high blood pressure'],
    'pediatrics': ['high fever', 'breathing problems', 'severe infections', 'accidents'],
    'gynecology': ['pregnancy complications', 'severe bleeding', 'pelvic pain', 'infections'],
    'orthopedics': ['fractures', 'severe joint pain', 'sports injuries', 'back pain']
  };
  
  const key = Object.keys(emergency).find(k => specialty.toLowerCase().includes(k));
  return emergency[key] || ['medical emergencies', 'acute symptoms', 'urgent health concerns', 'critical conditions'];
};

const getCosmeticServices = (specialty) => {
  const cosmetic = {
    'dentist': {
      type: 'cosmetic dentistry',
      services: ['teeth whitening', 'smile correction', 'veneers', 'aesthetic dental treatments']
    },
    'dental': {
      type: 'cosmetic dentistry', 
      services: ['teeth whitening', 'smile correction', 'veneers', 'aesthetic dental treatments']
    },
    'dermatology': {
      type: 'cosmetic dermatology',
      services: ['skin treatments', 'anti-aging therapies', 'acne treatment', 'aesthetic procedures']
    }
  };
  
  const key = Object.keys(cosmetic).find(k => specialty.toLowerCase().includes(k));
  return cosmetic[key] || null;
};

const getChildrenTreatmentAnswer = (specialty, name) => {
  if (specialty.toLowerCase().includes('pediatric') || specialty.toLowerCase().includes('child')) {
    return `Dr. ${name} specializes in pediatric care and treats children exclusively, providing comprehensive healthcare for infants, children, and adolescents.`;
  } else if (specialty.toLowerCase().includes('dentist') || specialty.toLowerCase().includes('dental')) {
    return `Yes, Dr. ${name} provides pediatric dental care, including cavity fillings, fluoride treatment, preventive guidance, and gentle dental care for children.`;
  } else if (specialty.toLowerCase().includes('gynecol')) {
    return `Dr. ${name} specializes in women's health and treats adolescent girls and women. For pediatric care, referrals to appropriate specialists are provided.`;
  } else {
    return `Yes, Dr. ${name} treats patients of all age groups including children, providing age-appropriate medical care and treatment with a gentle approach.`;
  }
};

const getRecommendationReasons = (specialty, keySpecialization) => {
  const baseReasons = 'gentle approach, modern equipment, affordable fees';
  const specialtyReasons = {
    'dentist': 'painless procedures, patient comfort, and aesthetic results',
    'dental': 'painless procedures, patient comfort, and aesthetic results', 
    'cardiology': 'accurate diagnosis, comprehensive heart care, and preventive guidance',
    'pediatrics': 'child-friendly approach, patient communication, and comprehensive care',
    'gynecology': 'compassionate care, women-centric approach, and confidential consultations'
  };
  
  const key = Object.keys(specialtyReasons).find(k => specialty.toLowerCase().includes(k));
  const specific = specialtyReasons[key] || 'accurate diagnosis, comprehensive treatment, and patient education';
  
  const specializations = keySpecialization.length > 0 ? ` with expertise in ${keySpecialization.join(', ')}` : '';
  
  return `${baseReasons}, ${specific}${specializations}`;
};

const DoctorProfileFAQ = ({ doctor, className = "" }) => {
  if (!doctor) return null;

  // Debug: Log doctor object structure to help identify name field
  console.log('Doctor object for FAQ:', doctor);
  
  const faqs = generateDoctorFAQs(doctor);
  
  // Extract doctor name from multiple possible sources (same logic as in generateDoctorFAQs)
  const doctorName = doctor.name || doctor.user?.name || doctor.fullName || 
                    (doctor.firstName && doctor.lastName ? `${doctor.firstName} ${doctor.lastName}` : null) || 
                    "Doctor";
  const specialty = doctor.specialty || "General Medicine";
  
  console.log('Extracted doctor name:', doctorName);

  return (
    <div className={`mt-8 ${className}`}>
      <SimpleFAQ
        faqs={faqs}
        title={`FAQ – Dr. ${doctorName} (${specialty})`}
        className={`shadow-lg bg-transparent ${className}`}
      />
    </div>
  );
};

export default DoctorProfileFAQ;
