'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Import client supabase yang sudah kita buat sebelumnya
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient(); // Inisialisasi client

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Error state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // --- FUNGSI LOGIN DENGAN GOOGLE ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setGeneralError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirect ke route handler untuk menukar 'code' menjadi 'session'
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setGeneralError(error.message);
      setLoading(false);
    }
  };

  // --- FUNGSI LOGIN MANUAL (EXISTING) ---
  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('Email wajib diisi');
      return;
    }

    if (!password) {
      setPasswordError('Password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field === 'email') setEmailError(data.message);
        else if (data.field === 'password') setPasswordError(data.message);
        else setGeneralError(data.message || 'Login gagal');
        return;
      }

      const role = data.role;
      switch (role) {
        case 'admin': router.push('/admin/dashboard'); break;
        case 'guru': router.push('/guru/dashboard'); break;
        case 'siswa': router.push('/siswa/dashboard'); break;
        default: setGeneralError('Role tidak dikenali');
      }

    } catch (err) {
      setGeneralError('Terjadi kesalahan server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl bg-blue-50 shadow-xl p-8">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="text-white" size={22} />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Sign in to your account</p>

        {/* GLOBAL ERROR */}
        {generalError && (
          <div className="mb-4 text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg border border-red-100">
            {generalError}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          {/* EMAIL */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className={`pr-16 ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MoreHorizontal size={18} />
              </div>
            </div>
            {emailError && <p className="text-xs text-red-600">{emailError}</p>}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pr-20 ${passwordError ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-400">
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <MoreHorizontal size={18} />
              </div>
            </div>
            {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* DIVIDER */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-blue-50 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* TOMBOL GOOGLE */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-4 h-4" 
          />
          Google
        </Button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{' '}
          <span 
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={handleGoogleLogin}
          >
            Sign up with Google
          </span>
        </p>

      </div>
    </div>
  );
}