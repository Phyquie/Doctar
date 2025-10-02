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
    <section className="py-5 bg-[#5f4191] rounded-lg text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold ">Consultant</h2>
        </div>
        
        <div className="bg-[#5f4191] border-2 border-white rounded-3xl p-8 mb-8 relative">
          <h3 className="text-2xl font-semibold text-center mb-8">
            Why <span className="text-blue-300">DOCTAR</span> For Doctors
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-6xl font-bold text-white">{feature.number}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold mb-2 text-white">{feature.title}</h4>
                  <p className="text-sm text-white opacity-90 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-right">
          <button className="bg-[#3a2557] text-white px-8 py-3 rounded-2xl font-semibold hover:bg-[#27173a] transition-colors shadow-lg">
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}
