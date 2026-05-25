import { create } from 'zustand';
import type { GaiaUser, UserRole } from '@/types';

interface AuthState {
  user: GaiaUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: GaiaUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Demo mode
  loginDemo: (role?: UserRole, email?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  // For demo purposes — bypass Firebase auth or use dynamic
  loginDemo: (role = 'farmer', email = 'demo@gaiagrid.ai') => {
    const namePart = email.split('@')[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    set({
      user: {
        uid: `demo-user-${Date.now()}`,
        email: email,
        displayName: displayName,
        photoURL: undefined,
        role,
        farmIds: ['farm-1'],
        createdAt: new Date(),
        lastLogin: new Date(),
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  }
}));
