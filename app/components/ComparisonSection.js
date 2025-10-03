export default function ComparisonSection() {
  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-center text-black font-bold text-lg sm:text-xl mt-2 mb-4 sm:mb-6">why choose DOCTAR ?</h2>
      
      {/* Mobile Layout - 2 divs per row */}
      <div className="md:hidden flex text-[10px] gap-2 sm:gap-3 rounded-xl mb-2">
        <div className="flex-col w-[180px] sm:w-[200px] flex shadow-lg rounded-xl overflow-hidden bg-white h-[260px] sm:h-[280px] flex-1">
          <div className="flex justify-center h-[40px] items-center">
            <img
              className="w-[80px] sm:w-[96px] h-[25px] sm:h-[31px]"
              src="/icons/logo.png"
              alt="no image"
            />
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7551B3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Thousands of doctors near you - find the right specialist easily</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-black">
            <p className="text-[9px] sm:text-[10px] leading-tight">Transparent consultation fees - no hidden charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7551B3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Complete doctor profiles - experience, specialization, reviews</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-black">
            <p className="text-[9px] sm:text-[10px] leading-tight">Lowest booking & consultation fees*</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7551B3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Instant appointment booking - connect with doctors in one click</p>
          </div>
        </div>
        <div className="flex-col w-[180px] sm:w-[200px] shadow-lg rounded-xl overflow-hidden bg-white h-[260px] sm:h-[280px] flex flex-1">
          <div className="flex justify-center h-[40px] items-center">
            <p className="text-[16px] sm:text-[20px] font-bold">Others</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7881A3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Limited doctors and specialists available</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-black">
            <p className="text-[9px] sm:text-[10px] leading-tight">Higher and unclear charges</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7881A3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Minimal information provided</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-black">
            <p className="text-[9px] sm:text-[10px] leading-tight">High booking and consultation charges*</p>
          </div>
          <div className="flex items-center h-[48px] p-2 sm:p-2.5 text-white bg-[#7881A3]">
            <p className="text-[9px] sm:text-[10px] leading-tight">Difficult and time-consuming to book appointments</p>
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
          <div className="flex justify-center h-[40px] items-center">
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
          <div className="flex justify-center h-[40px] items-center">
            <p className="text-[20px] font-bold">Others</p>
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


