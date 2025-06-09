
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; name?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (credentials: { email: string; password: string; name?: string }) => {
    // Simple mock authentication - in a real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      name: credentials.name || credentials.email.split('@')[0],
      email: credentials.email,
    };
    setUser(newUser);
    localStorage.setItem('libraryUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('libraryUser');
  };

  // Check for existing user on mount
  useState(() => {
    const savedUser = localStorage.getItem('libraryUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  });

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
