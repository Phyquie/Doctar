function TalkWithExpert() {
  return (
    <div className=" m-2 flex flex-col  bg-[#f2f1f9] rounded-2xl mt-[32px] overflow-hidden">
        <div className="w-full">
          <img
            src="/icons/expert.webp"
            alt="Doctor consultation"
            className="w-full md:w-2xl md:h-80 h-auto mx-auto md:mt-10 rounded-2xl object-cover"
          />
        </div>

        <div className="text-center gap-4 p-6 flex flex-col items-center justify-center">
          <h2 className="text-[#7551b3] font-bold text-2xl ">
            Talk With Expert
          </h2>

          <p className="text-black text-base font-bold leading-relaxed  px-2">
           Engage in genuine and confident discussions with industry-leading experts, fostering
 mutual trust, openly sharing valuable insights, and actively encouraging collaborative
, innovative problem-solving approaches for achieving shared, impactful, and sustainable .
          </p>

          <button className="bg-black rounded-lg text-white py-3 px-6 text-lg font-medium  hover:bg-gray-800 transition-colors">
            Ask a question
          </button>
        </div>
      </div>
  )
}

export default TalkWithExpert


