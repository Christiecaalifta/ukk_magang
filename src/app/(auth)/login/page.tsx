'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email dan password wajib diisi');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending login request...', { email, password });
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();
      console.log('Login response:', data, 'Status:', res.status);

      if (!res.ok) {
        alert(data.message);
        return;
      }

      const role = data.role;
      console.log('Role received:', role);

      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          console.log('Redirecting to /admin/dashboard');
          break;
        case 'guru':
          router.push('/guru/dashboard');
          break;
        case 'siswa':
          router.push('/siswa/dashboard');
          break;
        default:
          alert('Role tidak dikenali');
      }

    } catch (err) {
      alert('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl bg-blue-50 shadow-xl p-8">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="text-white" size={22} />
          </div>
        </div>

        <h1 className="text-center text-2xl font-bold text-gray-900">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Sign in to your account
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* EMAIL */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-16"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MoreHorizontal size={18} />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pr-20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 text-gray-400">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <MoreHorizontal size={18} />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{' '}
          <span className="text-blue-600 font-medium cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
