import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { profileService } from '../lib/services';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('msme_user');
    return saved ? JSON.parse(saved) : { id: 'user_2bd27b1c4c', email: 'entrepreneur@example.com' };
  });

  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data || {
        full_name: 'Ramesh Kumar',
        business_name: 'Kumar Agro Innovations',
        business_type: 'Micro',
        sector: 'Manufacturing',
        investment_amount: 800000,
        annual_turnover: 2500000,
      });
    } catch {
      setProfile({
        full_name: 'Ramesh Kumar',
        business_name: 'Kumar Agro Innovations',
        business_type: 'Micro',
        sector: 'Manufacturing',
        investment_amount: 800000,
        annual_turnover: 2500000,
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user]);

  const signIn = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    setUser(data.user);
    if (data.user?.id) {
      await fetchProfile(data.user.id);
    }
  };

  const signUp = async (email: string, pass: string) => {
    const res = await supabase.auth.signUp({ email, password: pass });
    if (res.error) throw res.error;
    setUser(res.data.user);
    return res;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
