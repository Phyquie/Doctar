export default function VisionMission() {
  return (
    <div className="flex h-[212px] lg:h-[265px] gap-1 lg:gap-4 text-white p-1 lg:p-4">
        <div className="flex-col flex-1 bg-[#7551b3] rounded-xl p-[8px] lg:p-6 lg:w-[490px]">
          <h2 className="text-2xl lg:text-2xl font-bold  lg:font-[500]">Vision</h2>
          <p className="text-[14px] lg:text-xl lg:font-[500] lg:leading-relaxed">
            To make quality healthcare accessible and reliable by connecting patients with trusted doctors and hospitals in 1260 City through a simple, transparent, and nationwide digital healthcare platform.

          </p>
        </div>
        <div className="flex-col flex-1 bg-[#313131] rounded-xl p-[8px] lg:p-6 lg:w-[490px]">
         <h2 className="text-2xl lg:text-2xl font-bold lg:font-[500]">Mission</h2> 
          <p className="text-[13px] lg:text-xl lg:font-[500] lg:leading-relaxed">
           To revolutionize healthcare using AI by providing smart doctor recommendations, easy bookings, and secure services, making quality medical care accessible to everyone, everywhere in India.
          </p>
        </div>
      </div>
  );
}


