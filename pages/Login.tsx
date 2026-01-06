
import React, { useState } from 'react';
import { setAdminAuth } from '../mockData';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Security Enforcement: Hardcoded manual credentials as requested
    if (username === 'yugassm' && password === 'YugaSports2026') {
      setAdminAuth(true);
      onLogin();
    } else {
      setError('Invalid credentials. Manual access only.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-oswald text-white uppercase tracking-tight">Admin Portal</h2>
        <p className="text-gray-400 text-sm mt-2">Secure manual access for YUGA 2026</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Admin Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Admin Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="text-red-400 text-xs italic bg-red-400/10 p-2 rounded border border-red-400/20">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs"
        >
          Authorize Access
        </button>
      </form>
    </div>
  );
};

export default Login;
