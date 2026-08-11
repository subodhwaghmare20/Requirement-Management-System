import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, StudentProfile } from '../types';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  updateLocalUser: (user: User) => void;
  updateLocalProfile: (profile: StudentProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('portal_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data.user);
        setStudentProfile(data.studentProfile);
      } catch (err) {
        localStorage.removeItem('portal_token');
        setToken(null);
        setUser(null);
        setStudentProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (payload: LoginPayload): Promise<User> => {
    const data = await authService.login(payload);
    if (data.token) {
      localStorage.setItem('portal_token', data.token);
      setToken(data.token);
    }
    setUser(data.user);
    setStudentProfile(data.studentProfile || null);
    return data.user;
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    const data = await authService.register(payload);
    if (data.token) {
      localStorage.setItem('portal_token', data.token);
      setToken(data.token);
    }
    setUser(data.user);
    setStudentProfile(data.studentProfile || null);
    return data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API warning:', err);
    } finally {
      localStorage.removeItem('portal_token');
      setToken(null);
      setUser(null);
      setStudentProfile(null);
    }
  };

  const updateLocalUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const updateLocalProfile = (updatedProfile: StudentProfile) => {
    setStudentProfile(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        token,
        isLoading,
        login,
        register,
        logout,
        updateLocalUser,
        updateLocalProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
