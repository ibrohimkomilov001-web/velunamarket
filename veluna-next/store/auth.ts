// =====================================================
// AUTH STORE - Zustand State Management
// =====================================================

import { create } from 'zustand';
import type { User, Profile, AuthState } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user: User | null) => set({ user }),

  setProfile: (profile: Profile | null) => set({ profile }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  logout: () => set({ user: null, profile: null }),
}));
