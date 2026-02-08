"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define User type based on DummyJSON response
// Keeping it flexible as requested, but adding known fields for better DX
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string; // Token might be in the user object from login
  [key: string]: any;
}

// Define Context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage and validate session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('ride_share_token');
      
      if (storedToken) {
        try {
          // Verify token with DummyJSON
          const response = await fetch('https://dummyjson.com/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`, 
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setToken(storedToken);
          } else {
            // Token invalid or expired
            console.warn('Session expired or invalid');
            localStorage.removeItem('ride_share_token');
            localStorage.removeItem('ride_share_user');
          }
        } catch (error) {
          console.error("Failed to verify session", error);
          localStorage.removeItem('ride_share_token');
          localStorage.removeItem('ride_share_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 60, // Optional: defaults to 60
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Save to state
      setToken(data.accessToken); // dummyjson returns 'accessToken'
      setUser(data);
      
      // Persist
      localStorage.setItem('ride_share_token', data.accessToken);
      localStorage.setItem('ride_share_user', JSON.stringify(data));

    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulation Only
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For simulation, we create a fake user object similar to dummyjson structure
    const newUser: User = {
      id: Date.now(), // Fake ID
      username: name.toLowerCase().replace(/\s/g, ''),
      email,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ')[1] || '',
      gender: 'unknown',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      token: 'fake-jwt-token-for-simulation',
    };

    // In a real app, we'd get a token. Here we simulate success but 
    // we CANNOT actually hit the protected endpoints with this fake token.
    // So the user will meet "Session expired" if they reload. 
    // However, for the "Mock" requirement, this validates the flow.
    setUser(newUser);
    setToken(newUser.token || '');
    // We don't save to localStorage to avoid breaking the "me" check on reload (it would fail)
    // Or we save it, but the reload check will fail and log them out, which is expected for "Guest/Mock" registration.
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ride_share_token');
    localStorage.removeItem('ride_share_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
