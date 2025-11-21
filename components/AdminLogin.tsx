
import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Fake authentication delay
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'medigo2025') {
        onLogin();
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-1">Admin Portal</h2>
        <p className="text-center text-slate-400 text-sm mb-8">Secure access for pharmacy partners</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter username"
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-slate-900/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onCancel} className="text-slate-400 text-sm hover:text-slate-600">
            Return to App
          </button>
        </div>
        
        {/* Hint for Demo */}
        <div className="mt-8 p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
          <p className="text-[10px] uppercase font-bold text-blue-400 mb-1">Demo Credentials</p>
          <p className="text-xs text-blue-800 font-mono">User: admin <br/> Pass: medigo2025</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
