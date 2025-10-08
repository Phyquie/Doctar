"use client"

import { useState } from "react";
import Image from "next/image";

const AboutUsMobile = ({ teamData = [] }) => {
  const [selectedMember, setSelectedMember] = useState(teamData[0] || null);

  return (
    <div className="md:hidden block p-3 bg-cover bg-center" style={{backgroundImage: 'url(/aboutUs/bg3.png)'}}>
      {/* Header Section */}
      <div className="mb-8 mt-7">
        <h1 className="text-4xl font-bold text-white mb-4">Our Team</h1>
        <p className="text-gray-100 text-base leading-relaxed">
          We're a dedicated team of creative minds, problem-solvers, and innovators working 
          together to deliver exceptional results. With diverse skills and shared passion, we 
          approach challenges with fresh perspectives and effective solutions. Collaboration, trust, and 
          respect guide our work, ensuring we exceed expectations. More than colleagues, we're a 
          family united by the mission to create meaningful impact for our clients and community.
        </p>
      </div>

      {/* Selected Member Detail - Shows above tiles when someone is selected */}
      {selectedMember && (
        <div className="mb-8 p-6  bg-white/10 border border-white/20
             backdrop-blur-lg backdrop-saturate-125 min-h-[350px] rounded-3xl text-white relative shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className={`${selectedMember.color} rounded-2xl p-3 flex items-center justify-center min-w-[70px] h-[70px] shadow-md`}>
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                width={45}
                height={45}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{selectedMember.name}</h2>
              <p className="text-white text-sm font-medium">{selectedMember.title}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-white">
           {selectedMember.description}
          </div>
        </div>
      )}

      {/* Team Member Tiles Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {teamData.map((member) => (
          <div
            key={member.id}
            className={`${member.color} rounded-2xl p-4 aspect-square cursor-pointer hover:scale-105 transition-all duration-300 max-h-24 flex items-center justify-center relative shadow-md ${
              selectedMember?.id === member.id ? 'ring-2 ring-gray-400' : ''
            }`}
            onClick={() => setSelectedMember(member)}
          >
            {selectedMember?.id === member.id ? (
              <Image
                src={member.image}
                alt={member.name}
                width={55}
                height={55}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                {member.initials}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUsMobile;