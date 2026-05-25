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
      setError('Please enter an email.');
      return;
    }
    setIsLoading(true);
    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 1000));
    loginDemo('farmer', email);
    router.push('/dashboard');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Simulate google login email
    loginDemo('farmer', 'google.user@gmail.com');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#030806]">
      <ParticleField count={40} />
      <div className="absolute inset-0 bg-gradient-mesh" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glass Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-50" />

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center mb-3"
              style={{ boxShadow: '0 0 30px rgba(0,255,136,0.3)' }}>
              <Leaf className="w-6 h-6 text-[#030806]" />
            </div>
            <h1 className="text-xl font-bold text-[#e8f5e9]">Welcome to <span className="text-[#00ff88]">GaiaGrid</span></h1>
            <p className="text-sm text-[#4a7c5c] mt-1">Sign in to your farm intelligence dashboard</p>
          </div>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-[rgba(0,255,136,0.15)] text-[#e8f5e9] font-medium text-sm hover:bg-[rgba(0,255,136,0.05)] transition-colors flex items-center justify-center gap-3 mb-6"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(0,255,136,0.08)]" />
            <span className="text-xs text-[#4a7c5c]">or</span>
            <div className="flex-1 h-px bg-[rgba(0,255,136,0.08)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#81c784] mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] focus-within:border-[rgba(0,255,136,0.3)] transition-colors">
                <Mail className="w-4 h-4 text-[#4a7c5c]" />
                <input
                  type="email"
                  placeholder="farmer@gaiagrid.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-[#e8f5e9] placeholder-[#2d5a3f] outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#81c784] mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] focus-within:border-[rgba(0,255,136,0.3)] transition-colors">
                <Lock className="w-4 h-4 text-[#4a7c5c]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-sm text-[#e8f5e9] placeholder-[#2d5a3f] outline-none w-full"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#4a7c5c] hover:text-[#81c784]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#ff3d57]">{error}</p>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-bold text-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(0,255,136,0.3)' }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#030806] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-[#4a7c5c]">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#00ff88] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
