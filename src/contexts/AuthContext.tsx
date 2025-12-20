import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo (Staff only - no patients)
const mockUsers: AuthUser[] = [
  { id: 'D001', name: 'Dr. Emily Chen', email: 'doctor@mediqueue.com', role: 'doctor' },
  { id: 'R001', name: 'Sarah Reception', email: 'reception@mediqueue.com', role: 'receptionist' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Mock authentication - find user by role
    const foundUser = mockUsers.find((u) => u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
