
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import { isAdminAuthenticated } from './mockData';

const App: React.FC = () => {
  const [view, setView] = useState<'leaderboard' | 'admin'>('leaderboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
    
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setView('admin');
      } else {
        setView('leaderboard');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Layout>
      {/* Floating Action Button for Admin Login - Positioned to avoid ribbons */}
      <a 
        href="#admin" 
        title="Admin Login"
        aria-label="Admin Login Button"
        className="fixed z-[100] bottom-[80px] right-[20px] w-[48px] h-[48px] md:w-[52px] md:h-[52px] flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 group border border-white/20"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="group-hover:rotate-12 transition-transform"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        
        {/* Hover Tooltip */}
        <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/90 text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 backdrop-blur-md shadow-xl">
          Admin Login
        </span>
      </a>

      {/* Minimal Navigation back to Board when in Admin View */}
      {view === 'admin' && (
        <div className="mb-8 flex justify-center">
          <a 
            href="#leaderboard" 
            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
          >
            ← Public View
          </a>
        </div>
      )}

      <div className="w-full flex items-center justify-center animate-in fade-in zoom-in duration-700">
        {view === 'leaderboard' ? (
          <Leaderboard />
        ) : (
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <AdminPanel onLogout={handleLogout} />
          )
        )}
      </div>
    </Layout>
  );
};

export default App;
