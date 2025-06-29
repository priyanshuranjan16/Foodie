'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { User } from '@/lib/convex';
import type { Id } from '@/convex/_generated/dataModel';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<Id<"users"> | null>(null);

  const signUpMutation = useMutation(api.auth.signUp);
  const signInMutation = useMutation(api.auth.signIn);
  const updateProfileMutation = useMutation(api.auth.updateProfile);
  
  const currentUser = useQuery(api.auth.getCurrentUser, 
    currentUserId ? { userId: currentUserId } : "skip"
  );

  useEffect(() => {
    // Check for stored user ID
    const storedUserId = localStorage.getItem('foodie-user-id');
    if (storedUserId) {
      setCurrentUserId(storedUserId as Id<"users">);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInMutation({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setCurrentUserId(result.user._id);
        localStorage.setItem('foodie-user-id', result.user._id);
        return { user: result.user, error: null };
      }
      return { user: null, error: new Error('Sign in failed') };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const result = await signUpMutation({
        email,
        password,
        full_name: userData.full_name,
        role: userData.role,
        phone: userData.phone,
        address: userData.address,
      });
      
      if (result.success) {
        // After successful signup, sign in the user
        return await signIn(email, password);
      }
      return { user: null, error: new Error('Sign up failed') };
    } catch (error) {
      return { user: null, error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setCurrentUserId(null);
    localStorage.removeItem('foodie-user-id');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { user: null, error: 'No user logged in' };
    
    try {
      const updatedUser = await updateProfileMutation({
        userId: user._id as Id<"users">,
        full_name: updates.full_name,
        phone: updates.phone,
        address: updates.address,
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        return { user: updatedUser, error: null };
      }
      return { user: null, error: new Error('Update failed') };
    } catch (error) {
      return { user: null, error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}