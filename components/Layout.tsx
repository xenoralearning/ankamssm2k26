
import React from 'react';
import Background from './Background';
import EventRibbon from './EventRibbon';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col pt-16 pb-16">
      <Background />
      <EventRibbon />
      
      <header className="py-8 px-4 text-center">
        <div className="flex flex-col items-center gap-4 mb-4">
           <div className="space-y-1 mt-2">
             <h2 className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-blue-400 uppercase">
               Seethi Sahib Memorial Polytechnic College
             </h2>
             <h1 className="text-6xl md:text-8xl font-black font-malayalam text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight">
               അങ്കം <span className="text-blue-500">2026</span>
             </h1>
             <p className="text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase italic">
               Organised by YUGA Students Union 2025–2026
             </p>
           </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto max-w-5xl px-4 relative z-10">
        {children}
      </main>

      <footer className="py-10 px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-500 tracking-[0.3em] uppercase font-bold">
            Created by <span className="text-white font-black">XenoraLearning</span>
          </p>
          <div className="w-12 h-[1px] bg-blue-500/30"></div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
