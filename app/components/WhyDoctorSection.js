import React from "react";
function WhyDoctarSection() {
  const features = [
    {
      id: 1,
      content:
        "Verified & Trusted Doctors – Every doctor listed on Doctar has a complete profile with qualifications, specialization, and experience details. This helps patients make confident and informed choices when selecting the right healthcare professional.",
    },
    {
      id: 2,
      content:
        "Direct & Instant Connection – Patients don't need to wait or go through middlemen. Doctar allows them to connect directly with doctors through phone calls, WhatsApp, email, or even by booking a clinic visit online — all in just a few clicks.",
    },
    {
      id: 3,
      content:
        "Convenient & Cost-Free Experience – Searching for the right doctor on Doctar is completely free for patients. The platform is designed to be fast, easy to use, and accessible anytime, making healthcare more approachable and stress-free.",
    },
  ];

  return (
    <div className="flex flex-col  items-center justify-center">
      <h2 className="text-center text-black md:p-4 font-bold py-2 text-xl">
        Why Doctar?
      </h2>
      <div className="flex bg-[#F2F2F2] justify-between rounded-3xl md:p-4 text-sm text-black p-2">
        {features.map((feature, index) => (
          <React.Fragment key={feature.id}>

          <div key={feature.id} className="relative p-1 rounded-md flex-1">
            <p className="text-black text-[11px] md:text-lg leading-tight font-poppins">
              {feature.content}
            </p>
          </div>
          {
            index < features.length - 1 && (
              <div className="left-0 mt-1 md:h-auto h-8 w-1 bg-purple-600 rounded mr-2"></div>
            )}
          
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default WhyDoctarSection;
