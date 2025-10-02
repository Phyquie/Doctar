'use client';

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full h-96 md:h-[500px]">
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto w-full min-w-xsm md:h-[40vw] h-[50vw]  min-h-30 relative">
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/3JFzDYq5NV4?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playlist=3JFzDYq5NV4&rel=0&iv_load_policy=3"
                  title="Video Banner"
                  allow="autoplay"
                  allowFullScreen
                  style={{
                    WebkitUserSelect: "none",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "101%",
                    height: "200%",
                    transform: "translate(-50%, -50%)",
                    minWidth: "100%",
                    minHeight: "100%",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
    </section>
  );
}
