
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type InstitutionType = "School" | "College" | "Public Institution" | "Hotel" | "Hospital" | "NGO";

interface User {
  id: string;
  name: string;
  email: string;
  institutionType: InstitutionType;
  institutionName: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => void;
  signup: (credentials: { 
    email: string; 
    password: string; 
    name: string;
    institutionType: InstitutionType;
    institutionName: string;
  }) => void;
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

  const login = (credentials: { email: string; password: string }) => {
    // Check if user exists in localStorage (simple session management)
    const savedUsers = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
    const existingUser = savedUsers.find((u: User) => u.email === credentials.email);
    
    if (existingUser) {
      setUser(existingUser);
      localStorage.setItem('currentLibraryUser', JSON.stringify(existingUser));
    } else {
      // For testing - create a default user if none exists
      const defaultUser: User = {
        id: Date.now().toString(),
        name: 'Test User',
        email: credentials.email,
        institutionType: 'School',
        institutionName: 'Test Institution'
      };
      setUser(defaultUser);
      
      // Save new user to users list
      const updatedUsers = [...savedUsers, defaultUser];
      localStorage.setItem('libraryUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('currentLibraryUser', JSON.stringify(defaultUser));
    }
  };

  const signup = (credentials: { 
    email: string; 
    password: string; 
    name: string;
    institutionType: InstitutionType;
    institutionName: string;
  }) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: credentials.name,
      email: credentials.email,
      institutionType: credentials.institutionType,
      institutionName: credentials.institutionName,
    };
    
    // Save to users list
    const savedUsers = JSON.parse(localStorage.getItem('libraryUsers') || '[]');
    savedUsers.push(newUser);
    localStorage.setItem('libraryUsers', JSON.stringify(savedUsers));
    
    // Set as current user
    setUser(newUser);
    localStorage.setItem('currentLibraryUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentLibraryUser');
  };

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentLibraryUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
