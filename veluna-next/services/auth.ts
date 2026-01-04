// =====================================================
// AUTH SERVICE - API Layer
// =====================================================

import { createClient } from '@/lib/supabase/client';
import type { User, Profile, LoginFormData, RegisterFormData } from '@/types';

const supabase = createClient();

// Sign in with email
export async function signIn(
  data: LoginFormData
): Promise<{ user: User | null; error: string | null }> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    console.error('Sign in error:', error);
    return { user: null, error: 'Email yoki parol noto\'g\'ri' };
  }

  return {
    user: authData.user
      ? {
          id: authData.user.id,
          email: authData.user.email,
          phone: authData.user.phone,
          created_at: authData.user.created_at,
        }
      : null,
    error: null,
  };
}

// Sign up with email
export async function signUp(
  data: RegisterFormData
): Promise<{ user: User | null; error: string | null }> {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.full_name,
        phone: data.phone,
      },
    },
  });

  if (error) {
    console.error('Sign up error:', error);
    if (error.message.includes('already registered')) {
      return { user: null, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
    }
    return { user: null, error: 'Ro\'yxatdan o\'tishda xatolik' };
  }

  // Create profile
  if (authData.user) {
    await supabase.from('profiles').insert({
      id: authData.user.id,
      full_name: data.full_name,
      phone: data.phone,
    });
  }

  return {
    user: authData.user
      ? {
          id: authData.user.id,
          email: authData.user.email,
          phone: authData.user.phone,
          created_at: authData.user.created_at,
        }
      : null,
    error: null,
  };
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    return { error: 'Chiqishda xatolik' };
  }

  return { error: null };
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    created_at: user.created_at,
  };
}

// Get user profile
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// Update user profile
export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ profile: Profile | null; error: string | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { profile: null, error: 'Profilni yangilashda xatolik' };
  }

  return { profile: data, error: null };
}

// Reset password
export async function resetPassword(
  email: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    console.error('Reset password error:', error);
    return { error: 'Xatolik yuz berdi' };
  }

  return { error: null };
}
