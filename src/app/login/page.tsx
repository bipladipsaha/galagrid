'use client';

import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { ParticleField } from '@/components/effects/ParticleField';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const { loginDemo, setError, error } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('System requires valid identifier.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    loginDemo('farmer', email);
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    loginDemo('farmer', 'operator.alpha@nexus.local');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[var(--gaia-bg-primary)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-holographic-grid opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--gaia-green-100)] opacity-40 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Glass Panel */}
        <div className="glass-panel p-10 relative overflow-hidden bg-white/90">
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--gaia-green-500)] to-transparent opacity-80" />
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 relative z-10">
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-[var(--gaia-green-500)] flex items-center justify-center mb-6 relative group shadow-lg"
              whileHover={{ scale: 1.05 }}
              animate={{ boxShadow: ['0 10px 20px rgba(62,79,50,0.2)', '0 15px 30px rgba(62,79,50,0.3)', '0 10px 20px rgba(62,79,50,0.2)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Leaf className="w-8 h-8 text-[var(--gaia-text-primary)] relative z-10" />
            </motion.div>
            <h1 className="text-2xl font-bold text-[var(--gaia-green-800)] tracking-widest uppercase text-center">
              AGRI<span className="text-[var(--gaia-green-500)]">MIND</span>
            </h1>
            <p className="text-xs text-[var(--gaia-text-muted)] mt-2 font-mono tracking-widest uppercase font-bold">Secure Access</p>
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-xl border border-[var(--gaia-border-glass)] bg-white text-[var(--gaia-text-primary)] font-bold text-sm hover:bg-gray-50 hover:border-[var(--gaia-green-200)] transition-all flex items-center justify-center gap-3 mb-8 tracking-wide relative z-10 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="flex-1 h-px bg-[var(--gaia-border-glass)]" />
            <span className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest font-bold">Or</span>
            <div className="flex-1 h-px bg-[var(--gaia-border-glass)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] text-[var(--gaia-text-muted)] mb-2 block font-mono uppercase tracking-widest font-bold">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-[var(--gaia-border-glass)] focus-within:border-[var(--gaia-green-500)] focus-within:bg-white transition-all shadow-inner">
                <Mail className="w-5 h-5 text-[var(--gaia-text-muted)]" />
                <input
                  type="email"
                  placeholder="operator@agrimind.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-[var(--gaia-text-primary)] placeholder-[var(--gaia-text-muted)] outline-none w-full font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[var(--gaia-text-muted)] mb-2 block font-mono uppercase tracking-widest font-bold">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-[var(--gaia-border-glass)] focus-within:border-[var(--gaia-green-500)] focus-within:bg-white transition-all shadow-inner">
                <Lock className="w-5 h-5 text-[var(--gaia-text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm text-[var(--gaia-text-primary)] placeholder-[var(--gaia-text-muted)] outline-none w-full tracking-[0.2em]"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[var(--gaia-text-muted)] hover:text-[var(--gaia-green-800)] transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 py-3 rounded-lg bg-red-50 border border-red-200"
              >
                <p className="text-xs text-[var(--gaia-red)] font-mono uppercase tracking-wide font-bold">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="btn-cyber w-full py-4 rounded-xl font-bold text-base uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[var(--gaia-green-900)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[var(--gaia-green-900)]">Authenticating...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10 text-[var(--gaia-green-900)]">Log In</span>
                  <ArrowRight className="w-5 h-5 relative z-10 text-[var(--gaia-green-900)]" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 relative z-10">
            <p className="text-[11px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest font-bold">
              Unregistered Operator?{' '}
              <Link href="/signup" className="text-[var(--gaia-green-600)] hover:text-[var(--gaia-green-800)] transition-colors ml-1 border-b border-transparent hover:border-[var(--gaia-green-800)]">
                Request Clearance
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
