
import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import { getStoredDepartments, updateDepartmentData, setAdminAuth } from '../mockData';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [formData, setFormData] = useState<Partial<Department>>({
    totalPoints: 0,
    gold: 0,
    silver: 0,
    bronze: 0
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    try {
      const data = await getStoredDepartments();
      setDepartments(data);
      if (data.length > 0 && !selectedDeptId) {
        handleSelectDept(data[0].id, data);
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectDept = (id: string, data = departments) => {
    setSelectedDeptId(id);
    const dept = data.find(d => d.id === id);
    if (dept) {
      setFormData({
        totalPoints: dept.totalPoints,
        gold: dept.gold,
        silver: dept.silver,
        bronze: dept.bronze
      });
    }
    setStatus({ type: '', message: '' });
  };

  const handleSaveAttempt = () => {
    if (!selectedDeptId) return;
    if (formData.totalPoints! < 0 || formData.gold! < 0 || formData.silver! < 0 || formData.bronze! < 0) {
      setStatus({ type: 'error', message: 'CRITICAL: Values cannot be negative.' });
      return;
    }
    setShowConfirm(true);
  };

  const confirmAndSave = async () => {
    try {
      setIsSyncing(true);
      setShowConfirm(false);
      const updated = await updateDepartmentData(selectedDeptId, formData);
      setDepartments(updated);
      setStatus({ type: 'success', message: 'Cloud scores updated successfully' });
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Cloud update failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = () => {
    setAdminAuth(false);
    onLogout();
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-oswald text-white uppercase italic">Manual Cloud Manager</h2>
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Authorized Access: yugassm</p>
        </div>
        <button 
          onClick={logout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-xl border border-red-500/20 text-xs font-bold uppercase transition-all"
        >
          End Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department List */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-fit max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Target</h3>
            <button onClick={loadData} className="text-[10px] text-blue-400 font-bold uppercase hover:underline">Refresh</button>
          </div>
          {isSyncing && departments.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-white/20 uppercase text-[10px] font-bold tracking-widest">Syncing Cloud...</div>
            </div>
          ) : (
            <div className="space-y-2">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    selectedDeptId === dept.id 
                      ? 'bg-white text-black border-transparent shadow-xl scale-[1.02]' 
                      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold text-sm line-clamp-1">{dept.name}</div>
                  <div className={`text-[10px] mt-1 font-bold ${selectedDeptId === dept.id ? 'text-black/50' : 'text-gray-600'}`}>
                    SCORE: {dept.totalPoints} | G:{dept.gold} S:{dept.silver} B:{dept.bronze}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {selectedDept ? (
              <div className="space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-oswald text-white mb-1 uppercase italic">{selectedDept.name}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Live Sync Status: {new Date(selectedDept.lastUpdated).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Manual Cloud Mode</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-2 tracking-widest">Gold</label>
                    <input 
                      type="number" 
                      value={formData.gold}
                      onChange={(e) => setFormData({...formData, gold: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 text-center text-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-2 tracking-widest">Silver</label>
                    <input 
                      type="number" 
                      value={formData.silver}
                      onChange={(e) => setFormData({...formData, silver: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gray-300 text-center text-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-2 tracking-widest">Bronze</label>
                    <input 
                      type="number" 
                      value={formData.bronze}
                      onChange={(e) => setFormData({...formData, bronze: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-center text-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-white/40 mb-2 tracking-widest">Total Points</label>
                    <input 
                      type="number" 
                      value={formData.totalPoints}
                      onChange={(e) => setFormData({...formData, totalPoints: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-blue-400 focus:outline-none focus:border-blue-400 text-center text-2xl font-black"
                    />
                  </div>
                </div>

                {status.message && (
                  <div className={`p-4 rounded-xl text-center text-xs font-bold border uppercase tracking-widest ${
                    status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {status.message}
                  </div>
                )}

                <button 
                  onClick={handleSaveAttempt}
                  disabled={isSyncing}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all shadow-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 ${isSyncing ? 'opacity-50' : ''}`}
                >
                  {isSyncing ? 'Syncing Cloud...' : 'Update Leaderboard Data'}
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-white/20 font-bold uppercase tracking-[0.2em]">
                Select a department to manage scores
              </div>
            )}

            {showConfirm && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center">
                <div className="space-y-6 max-w-xs">
                  <h4 className="text-xl font-oswald text-white uppercase italic">Confirm Update?</h4>
                  <p className="text-white/60 text-xs">This will update the live scores for <span className="text-white font-bold">{selectedDept?.name}</span> on the public leaderboard.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-white/10 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmAndSave}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 italic">Security Audit Check</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-white/30 text-[8px] uppercase font-bold mb-1 tracking-widest">Data Source</div>
                 <div className="text-xs font-bold text-white uppercase">Cloud Firestore</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-white/30 text-[8px] uppercase font-bold mb-1 tracking-widest">Logic Control</div>
                 <div className="text-xs font-bold text-white uppercase">Admin Only</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-white/30 text-[8px] uppercase font-bold mb-1 tracking-widest">Sync Status</div>
                 <div className="text-xs font-bold text-blue-400 uppercase">Live</div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                 <div className="text-white/30 text-[8px] uppercase font-bold mb-1 tracking-widest">System Path</div>
                 <div className="text-xs font-bold text-white uppercase">yugassm/cloud</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
