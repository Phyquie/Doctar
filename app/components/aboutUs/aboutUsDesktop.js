"use client"

import { useState } from "react";
import Image from "next/image";

const AboutUsDesktop = ({ teamData = [] }) => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="max-w-6xl mx-auto w-full p-5 rounded-[15px] bg-white/10 border border-white/20 backdrop-blur-lg backdrop-saturate-125 shadow-lg hidden md:block mt-10">
      {!selectedMember ? (
        <>
          <h1 className="text-4xl font-bold text-black mb-6">Our Team</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="max-w-md">
              <p className="text-lg text-black leading-relaxed">
                We're a dedicated team of creative minds, problem-solvers, and innovators working 
                together to deliver exceptional results. With diverse skills and shared passion, we 
                approach challenges with fresh perspectives and effective solutions. 
                Collaboration, trust, and respect guide our work, ensuring we exceed expectations. 
                More than colleagues, we're a family united by the mission to create meaningful impact 
                for our clients and community.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {teamData.map((member, index) => (
                <div
                  key={member.id}
                  className={`${member.color} rounded-4xl p-4 aspect-square cursor-pointer hover:scale-105 transition-all duration-300 max-h-28 min-w-32 flex items-center justify-center`}
                  onClick={() => setSelectedMember(member)}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedMember(null)}
            className="mb-4 text-black hover:text-black font-medium transition-colors"
          >
            ← Back to Our Team
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="max-w-md transform transition-all duration-500 animate-in slide-in-from-left" key={selectedMember.id}>
                <h1 className="text-3xl font-bold text-black mb-1">{selectedMember.name}</h1>
                <h2 className="text-md text-gray-900 mb-2">{selectedMember.title}</h2>
                <div className="border-gray-300 border-2 mb-2 w-[200px]"></div>
                <p className="text-md text-gray-900 leading-relaxed">
                  {selectedMember.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {teamData.map((member, index) => (
                <div
                  key={member.id}
                  className={`${member.color} ${member.id === selectedMember.id ? 'opacity-100' : 'opacity-80'} p-4 aspect-square cursor-pointer hover:scale-105 hover:opacity-100 transition-all duration-300 max-h-28 min-w-32 rounded-4xl flex items-center justify-center`}
                  onClick={() => setSelectedMember(member)}
                >
                  {member.id === selectedMember.id ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-600">
                      {member.initials}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUsDesktop;