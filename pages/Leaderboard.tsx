
import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { subscribeToDepartments } from '../mockData';

const Leaderboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Real-time listener: this stays open and updates the UI whenever database changes
    const unsubscribe = subscribeToDepartments(
      (data) => {
        const sorted = [...data].sort((a, b) => {
          if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
          if (b.gold !== a.gold) return b.gold - a.gold;
          if (b.silver !== a.silver) return b.silver - a.silver;
          return b.bronze - a.bronze;
        });
        setDepartments(sorted);
        setLastSync(new Date().toLocaleTimeString());
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || "Cloud Connection Lost");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <span className="bg-gradient-to-br from-yellow-300 to-yellow-600 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-[0_4px_15px_rgba(234,179,8,0.5)]">1</span>;
      case 2: return <span className="bg-gradient-to-br from-gray-100 to-gray-400 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-[0_4px_15px_rgba(255,255,255,0.2)]">2</span>;
      case 3: return <span className="bg-gradient-to-br from-orange-400 to-orange-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-[0_4px_15px_rgba(194,120,57,0.4)]">3</span>;
      default: return <span className="text-white w-10 h-10 flex items-center justify-center font-bold text-lg">{rank}</span>;
    }
  };

  return (
    <div className="w-full space-y-12 pb-10">
      <div className="flex justify-between items-center px-2">
        <div className="flex flex-col">
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Standings</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${error ? 'text-red-400' : 'text-white/40'}`}>
            {loading ? 'Connecting...' : error ? 'Cloud Sync Issue' : `Sync: ${lastSync} (Live)`}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {loading && departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Initialising Standings</p>
        </div>
      ) : error && departments.length === 0 ? (
        <div className="text-center py-24 bg-red-500/5 rounded-[3rem] border border-red-500/10 backdrop-blur-xl px-8">
           <div className="text-4xl mb-6">🔒</div>
           <h3 className="text-red-400 font-bold text-xl uppercase tracking-widest mb-3">Database Connection Blocked</h3>
           <p className="text-white/60 text-xs max-w-md mx-auto leading-relaxed mb-6 font-medium">
             {error}
           </p>
        </div>
      ) : (
        <>
          {/* Top 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {departments.slice(0, 3).map((dept, idx) => (
              <div 
                key={dept.id} 
                className={`group relative overflow-hidden rounded-[2rem] p-8 border border-white/10 transition-all duration-700 ${
                  idx === 0 
                  ? 'bg-gradient-to-b from-white/15 to-white/5 scale-105 z-20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-blue-500/40' 
                  : 'bg-white/[0.03] z-10'
                } backdrop-blur-2xl`}
              >
                 <div className="absolute top-0 right-0 p-4 font-oswald text-7xl opacity-[0.05] italic font-black pointer-events-none">#{idx + 1}</div>
                 <div className="relative z-10 flex flex-col h-full justify-between">
                   <div>
                     <h3 className="font-bold text-xl mb-4 leading-tight min-h-[3rem] group-hover:text-blue-400 transition-colors">{dept.name}</h3>
                     <div className="flex items-baseline gap-2">
                       <span className="text-6xl font-black text-white">{dept.totalPoints}</span>
                       <span className="text-xs uppercase tracking-[0.2em] text-white font-bold">Pts</span>
                     </div>
                   </div>
                   
                   <div className="flex gap-8 mt-10 pt-6 border-t border-white/5">
                      <div className="flex flex-col items-center">
                        <div className="text-yellow-400 font-black text-2xl">{dept.gold}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white">Gold</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-gray-300 font-black text-2xl">{dept.silver}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white">Silver</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-orange-600 font-black text-2xl">{dept.bronze}</div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white">Bronze</div>
                      </div>
                   </div>
                 </div>
              </div>
            ))}
          </div>

          {/* List View */}
          <div className="w-full overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-10 py-7 font-black text-[10px] uppercase tracking-[0.4em] text-white">Rank</th>
                    <th className="px-10 py-7 font-black text-[10px] uppercase tracking-[0.4em] text-white">Department</th>
                    <th className="px-6 py-7 font-black text-[10px] uppercase tracking-[0.4em] text-white text-center">Medals</th>
                    <th className="px-10 py-7 font-black text-[10px] uppercase tracking-[0.4em] text-white text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {departments.map((dept, idx) => (
                    <tr key={dept.id} className="hover:bg-white/[0.04] transition-all group">
                      <td className="px-10 py-6 whitespace-nowrap">
                        {getRankBadge(idx + 1)}
                      </td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{dept.name}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-yellow-400 font-black text-lg">{dept.gold}</span>
                            <div className="w-1 h-1 rounded-full bg-yellow-400/40"></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-gray-200 font-black text-lg">{dept.silver}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-200/40"></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-orange-600 font-black text-lg">{dept.bronze}</span>
                            <div className="w-1 h-1 rounded-full bg-orange-600/40"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="font-oswald text-4xl font-black text-white group-hover:text-blue-500 transition-colors">
                          {dept.totalPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
