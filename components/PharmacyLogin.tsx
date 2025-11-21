
import React, { useState } from 'react';
import { Store, Lock, ArrowRight, KeyRound } from 'lucide-react';
import Logo from './Logo';

interface PharmacyLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const PharmacyLogin: React.FC<PharmacyLoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (username.toLowerCase() === 'pharmacy' && password === 'pharmacy2025') {
        onLogin();
      } else {
        setError('Invalid pharmacy credentials');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 rounded-b-[3rem] z-0"></div>
      
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="flex justify-center mb-6 -mt-16">
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <Logo className="w-16 h-16" />
          </div>
        </div>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Pharmacy Portal</h2>
            <p className="text-slate-400 text-sm">Manage inventory & track orders</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Pharmacy ID</label>
            <div className="relative">
              <Store className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="e.g. pharmacy"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 flex items-center justify-center gap-2">
              <KeyRound className="w-3 h-3" /> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onCancel} className="text-slate-400 text-sm hover:text-slate-600">
            Not a pharmacy? Login as Guest
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Demo Access</p>
          <p className="text-xs text-slate-600 font-mono">ID: pharmacy <br/> Pass: pharmacy2025</p>
        </div>
      </div>
    </div>
  );
};

export default PharmacyLogin;
