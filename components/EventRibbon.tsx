
import React from 'react';

const EventRibbon: React.FC = () => {
  return (
    <>
      {/* Top Ribbon - Blue Gradient with White Text */}
      <div className="fixed top-0 left-0 w-full z-[70] overflow-hidden bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] py-1.5 border-b border-white/20 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-white font-bold uppercase tracking-[0.15em] text-[11px] md:text-sm mx-10 flex items-center gap-3">
              <span className="font-malayalam">അങ്കം 2026</span> 
              <span className="opacity-40">•</span> 
              <span>SSM Polytechnic College</span> 
              <span className="opacity-40">•</span> 
              <span>YUGA</span>
              <span className="ml-4 opacity-30">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Ribbon - White/Silver with Deep Blue Text and Metallic Shine */}
      <div className="fixed bottom-0 left-0 w-full z-[70] overflow-hidden bg-gradient-to-r from-gray-100 via-white to-gray-100 py-2 border-t border-black/10 shadow-[0_-4px_15px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 shimmer-effect opacity-30 pointer-events-none"></div>
        <div className="flex whitespace-nowrap animate-marquee-reverse relative z-10">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="text-[#1E3A8A] font-black uppercase tracking-[0.25em] text-[10px] md:text-xs mx-12 flex items-center gap-4">
              XENORALEARNING — AI education for every generation 
              <span className="text-blue-600/30">✦</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
      `}</style>
    </>
  );
};

export default EventRibbon;
