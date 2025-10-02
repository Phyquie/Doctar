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
    name: "Dr. Abhishek",
    rating: 3,
    review:
      "Professional and caring approach. Highly recommend for anyone seeking quality healthcare services.",
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
            className={`w-4 h-4 ${filled ? "text-yellow-400" : "text-gray-300"}`}
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

function ReviewCard({ review }) {
  return (
    <article className="bg-white border border-blue-100 rounded-2xl max-h-28 min-h-28 shadow-sm w-full md:w-[80%] lg:w-[78%] p-4 md:p-6 flex items-start">
      <div className="flex-shrink-0 ">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/icons/doctor.png";
            }}
          />
        </div>
      </div>

      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-semibold text-lg text-gray-900">{review.name}</h4>
          <div className="ml-2">
            <Stars rating={review.rating} />
          </div>
        </div>

        <p className="text-[10px] text-gray-700  leading-relaxed">
          {review.review}
        </p>
      </div>
    </article>
  );
}

function ReviewsPanel({ title, reviews }) {
  return (
    <div className="bg-[#FBFAFF] rounded-2xl p-6 border border-blue-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-purple-600">{title}</h3>
        <button className="text-purple-600 hover:text-purple-800 font-medium">
          View All &gt;
        </button>
      </div>

      <div className="flex-1 space-y-6">
        {reviews.map((r, idx) => (
          <div
            key={r.id}
            className={`w-full flex ${
              idx % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <ReviewCard review={r} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
          Post a review
        </button>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-16 mt-9">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ReviewsPanel title="Doctor Experience" reviews={doctorReviews} />
          <ReviewsPanel title="Patient Experience" reviews={patientReviews} />
        </div>
      </div>
    </section>
  );
}
