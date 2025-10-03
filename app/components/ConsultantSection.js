'use client';

const features = [
  {
    id: 1,
    number: "1",
    title: "Reach More Patients",
    description: "Get discovered easily by patients searching by specialty, location, and expertise."
  },
  {
    id: 2,
    number: "2", 
    title: "Direct Communication",
    description: "Connect instantly with patients via call, WhatsApp, email, or clinic booking."
  },
  {
    id: 3,
    number: "3",
    title: "Zero Commission", 
    description: "Doctar doesn't charge on consultations, only promotes visibility for doctors."
  }
];

export default function ConsultantSection() {
  return (
    <div>
      <h3 className="text-center md:hidden text-black font-bold text-xl mb-4">
        Consultant
      </h3>
      <div className="bg-[#5f4191] w-full p-1 md:p-4">
        <h2 className="text-center text-white text-2xl mb-2 md:mb-4">
          Consultant
        </h2>

        <div className="flex flex-col items-center justify-center p-1 md:p-4 border-1 border-white rounded-3xl mb-2">
          <h2 className="text-center text-white font text-lg sm:text-xl mb-4">
            Why <span className="font-extrabold text-[#4D9FF1]">DOCTAR</span>{" "}
            for Doctors
          </h2>

          <div className="flex w-full mb-6">
            {features.map((feature) => (
              <div key={feature.id} className="flex-1 flex md:gap-2 items-start">
                <div className="font-bold text-6xl md:text-8xl text-white leading-none">
                  {feature.number}
                </div>
                <div className="flex-1">
                  <p className="text-[9px] md:text-xl font-bold text-white leading-tight">
                    {feature.title}
                  </p>
                  <p className="text-[9px] md:text-lg text-white mt-1 leading-tight">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Now Button */}
        <div className="flex justify-end mb-1">
          <button className="bg-[#5154B5] text-white px-6 border py-2 sm:px-8 sm:py-3 rounded-2xl font-semibold hover:opacity-90 transition-colors text-sm sm:text-base">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
