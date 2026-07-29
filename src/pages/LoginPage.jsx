import React, { useState } from 'react';
import { BookOpen, Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check credentials (rsnr4u / password123)
    if (username.trim() === 'rsnr4u' && password === 'password123') {
      setIsLoading(true);
      setTimeout(() => {
        localStorage.setItem('digibook_auth', 'true');
        localStorage.setItem('digibook_user', 'rsnr4u');
        onLogin();
      }, 500);
    } else {
      setError('ఇచ్చిన యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ సరికాడు. దయచేసి వివరాలు సరిచూసుకోండి.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Digi<span className="text-blue-500">book</span> Portal
            </h2>
            <p className="text-xs text-slate-400 font-telugu mt-1 font-medium">
              కార్పొరేట్ డిజిటల్ నాలెడ్జ్ హబ్ లాగిన్
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-950/70 border border-rose-800/70 rounded-2xl text-xs text-rose-300 flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="font-telugu font-medium leading-relaxed">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Username (యూజర్‌నేమ్)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Password (పాస్‌వర్డ్)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? (
              <span>లాగిన్ అవుతోంది...</span>
            ) : (
              <>
                <span className="font-telugu">లాగిన్ చేయండి (Login)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} Digibook Secure Platform. Authorized Access Only.
        </div>
      </motion.div>
    </div>
  );
}
