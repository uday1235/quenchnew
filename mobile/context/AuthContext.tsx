import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '@/lib/api';
import { getToken, removeToken, removeUser, saveToken, saveUser } from '@/lib/storage';

export interface AuthUser {
  id: string;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  role: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      if (t) {
        setToken(t);
        try {
          const { data } = await getMe();
          setUser(data);
        } catch {
          await removeToken();
          await removeUser();
        }
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (t: string, u: AuthUser) => {
    await saveToken(t);
    await saveUser(u);
    setToken(t);
    setUser(u);
  };

  const signOut = async () => {
    await removeToken();
    await removeUser();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await getMe();
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
