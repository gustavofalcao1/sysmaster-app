'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types';
import { db } from '@/lib/database';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Verificar se o usuário ainda existe no banco
      const currentUser = db.getUserById(userData.id);
      if (currentUser) {
        setUser(currentUser);
      } else {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Se não estiver autenticado e não estiver em uma rota pública
      if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      }
      // Se estiver autenticado e estiver em uma rota pública
      else if (user && PUBLIC_ROUTES.includes(pathname)) {
        router.push('/');
      }
    }
  }, [user, pathname, isLoading, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = db.getUserByUsername(username);

    if (foundUser && foundUser.password === password) {
      // Em produção, usar comparação de hash
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
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
