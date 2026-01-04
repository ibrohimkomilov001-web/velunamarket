// =====================================================
// REGISTER FORM - Client Component
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import { signUp, getProfile } from '@/services/auth';
import toast from 'react-hot-toast';

export function RegisterForm() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Ismingizni kiriting';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email kiriting';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email noto\'g\'ri';
    }

    if (!formData.password) {
      newErrors.password = 'Parol kiriting';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parollar mos kelmayapti';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { user, error } = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
      });

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

        toast.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
        router.push('/');
      }
    } catch (err) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Ism Familiya"
        placeholder="Ism Familiya"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        error={errors.full_name}
      />

      <Input
        label="Email"
        type="email"
        placeholder="email@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />

      <Input
        label="Telefon (ixtiyoriy)"
        type="tel"
        placeholder="+998 90 123 45 67"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <div className="relative">
        <Input
          label="Parol"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

      <Input
        label="Parolni tasdiqlash"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        error={errors.confirmPassword}
      />

      <Button type="submit" fullWidth loading={loading}>
        Ro'yxatdan o'tish
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Ro'yxatdan o'tish orqali siz{' '}
        <a href="/terms" className="text-primary-600 hover:underline">
          foydalanish shartlari
        </a>
        ga rozilik bildirasiz.
      </p>
    </form>
  );
}
