// =====================================================
// LOGIN FORM - Client Component
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { signIn, getProfile } from '@/services/auth';
import toast from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();
  const { setUser, setProfile, setLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email kiriting';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email noto\'g\'ri';
    }

    if (!password) {
      newErrors.password = 'Parol kiriting';
    } else if (password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLocalLoading(true);

    try {
      const { user, error } = await signIn({ email, password });

      if (error) {
        toast.error(error);
        return;
      }

      if (user) {
        setUser(user);
        
        // Get profile
        const profile = await getProfile(user.id);
        if (profile) {
          setProfile(profile);
        }

        toast.success('Muvaffaqiyatli kirdingiz!');
        router.push('/');
      }
    } catch (err) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
      </div>

      <div>
        <div className="relative">
          <Input
            label="Parol"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" />
          <span className="text-sm text-gray-600">Eslab qolish</span>
        </label>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary-600 hover:underline"
        >
          Parolni unutdingizmi?
        </Link>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Kirish
      </Button>
    </form>
  );
}
