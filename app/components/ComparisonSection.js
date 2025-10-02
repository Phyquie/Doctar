export default function ComparisonSection() {
  return (
    <div className="p-2">
      <h2 className="text-center text-black font-bold text-xl mt-2 mb-2">why choose DOCTAR ?</h2>
      
      {/* Mobile Layout - 2 divs per row */}
      <div className="md:hidden flex text-[10px] gap-2.5 rounded-xl mb-2">
        <div className="flex-col w-[200px] flex shadow-lg rounded-xl overflow-hidden bg-white h-[280px] flex-1">
          <div className="flex justify-center h-[40px]">
            <img
              className="w-[96px] h-[31px]"
              src="/icons/logo.png"
              alt="no image"
            />
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-[10px]">Thousands of doctors near you - find the right specialist easily</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-[10px]">Transparent consultation fees - no hidden charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-[10px]">Complete doctor profiles - experience, specialization, reviews</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-[10px]">Lowest booking & consultation fees*</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-[10px]">Instant appointment booking - connect with doctors in one click</p>
          </div>
        </div>
        <div className="flex-col w-[200px] shadow-lg rounded-xl overflow-hidden bg-white h-[280px] flex flex-1">
          <div className="flex justify-center h-[40px]">
            <p className="text-[20px]">Others</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-[10px]">Limited doctors and specialists available</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-[10px]">Higher and unclear charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-[10px]">Minimal information provided</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-[10px]">High booking and consultation charges*</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-[10px]">Difficult and time-consuming to book appointments</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout - 3 divs of equal size */}
      <div className="hidden md:flex gap-4 rounded-xl mb-2">
        {/* First div - Image only (leftmost) */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[280px] flex">
          <div className="flex justify-center items-center h-full">
            <img
              className="w-full h-full object-cover"
              src="/icons/doctor.png"
              alt="Doctor"
            />
          </div>
        </div>

        {/* Second div with Doctar logo */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[280px] flex">
          <div className="flex justify-center h-[40px]">
            <img
              className="w-[96px] h-[31px]"
              src="/icons/logo.png"
              alt="Doctar logo"
            />
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-sm">Thousands of doctors near you - find the right specialist easily</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-sm">Transparent consultation fees - no hidden charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-sm">Complete doctor profiles - experience, specialization, reviews</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-sm">Lowest booking & consultation fees*</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7551B3]">
            <p className="text-sm">Instant appointment booking - connect with doctors in one click</p>
          </div>
        </div>

        {/* Third div */}
        <div className="flex-1 flex-col shadow-lg rounded-xl overflow-hidden bg-white h-[280px] flex">
          <div className="flex justify-center h-[40px]">
            <p className="text-[20px]">Others</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Limited doctors and specialists available</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-sm">Higher and unclear charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Minimal information provided</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-black">
            <p className="text-sm">High booking and consultation charges*</p>
          </div>
          <div className="flex items-center h-[48px] p-2.5 text-white bg-[#7881A3]">
            <p className="text-sm">Difficult and time-consuming to book appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
}


