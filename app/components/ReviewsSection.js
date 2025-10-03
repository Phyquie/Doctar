"use client";

import React from "react";

const doctorReviews = [
  {
    id: 1,
    name: "Dr. Sunita Jain",
    rating: 4,
    review:
      "Excellent consultation experience. The doctor was very knowledgeable and patient in explaining the treatment options.",
    avatar: "/icons/doctor.png",
  },
  {
    id: 2,
    name: "Dr. Aryan Kumar",
    rating: 5,
    review:
      "Professional and caring approach. Highly recommend for anyone seeking quality healthcare services.",
    avatar: "/icons/doctor.png",
  },
  {
    id: 3,
    name: "Dr. Abhishek Sharma",
    rating: 3,
    review:
      "Great communication and thorough examination. Very satisfied with the overall experience.",
    avatar: "/icons/doctor.png",
  },
];

const patientReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 4,
    review:
      "Amazing experience! The doctor was very attentive and explained everything clearly. Highly recommended!",
    avatar: "/icons/doctor.png",
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 5,
    review:
      "Professional service with great care. The consultation was thorough and the staff was very helpful.",
    avatar: "/icons/doctor.png",
  },
  {
    id: 3,
    name: "Sneha Patel",
    rating: 3,
    review:
      "Very satisfied with the treatment. Clean facility and friendly doctors. Will definitely visit again.",
    avatar: "/icons/doctor.png",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => {
        const filled = i < rating;
        return (
          <svg
            key={i}
            className={`w-3 h-3 ${filled ? "text-yellow-400" : "text-gray-300"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

function ReviewCard({ review, index }) {
  return (
    <div
      className={`bg-white rounded-2xl w-full max-w-[310px] md:w-[348px] md:max-w-[348px] h-[70px] sm:h-[82px] md:h-[92px] flex flex-row gap-2 sm:gap-[12px] py-3 sm:py-[16px] px-2 sm:px-[12px] mb-2 sm:mb-3 ${index % 2 === 0 ? 'ml-0' : 'ml-auto'}`}
    >
      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10 rounded-full overflow-hidden flex-shrink-0">
        <img className="object-cover h-8 w-8 sm:h-10 sm:w-10 md:h-10 md:w-10" src={review.avatar} alt={review.name} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h2 className="capitalize font-medium text-xs sm:text-sm truncate">{review.name}</h2>
          <div className="flex gap-1 flex-shrink-0">
            <Stars rating={review.rating || 5} />
          </div>
        </div>
        <p className="text-[7px] sm:text-[8.31px] text-gray-600 line-clamp-2 leading-tight">{review.review}</p>
      </div>
    </div>
  );
}

function ReviewsPanel({ title, reviews }) {
  return (
    <div className="bg-[#F2F1F9] rounded-[20px] p-3 sm:p-4 m-2 mt-4 h-full relative">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-[#9B51E0] text-center font-semibold text-base sm:text-lg">{title}</h2>
        <div className="text-sm text-[#9B51E0] font-medium cursor-pointer hover:text-[#7C3AED] transition-colors">View All &gt;</div>
      </div>
    
      {reviews.map((review, i) => (
        <ReviewCard key={review.id} review={review} index={i} />
      ))}
    
      <div className="flex justify-center mt-2 mb-1">
        <button className="bg-black text-white text-xs py-2 px-4 rounded-xl hover:bg-gray-800 transition-colors">
          Post a review
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 items-stretch">
      <ReviewsPanel title="Doctor Experience" reviews={doctorReviews} />
      <ReviewsPanel title="Patient Experience" reviews={patientReviews} />
    </div>
  );
}
