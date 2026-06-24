import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser, updateProfile } from "../Services/api";

// TYPES
export type UserType = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (name: string) => Promise<{ success: boolean; message?: string }>;
};

// CONTEXT
const AuthContext = createContext<AuthContextType | null>(null);

// HOOK
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};


// PROVIDER
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // check if user is already logged in on site load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.success) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // login
  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password });
      if (res.success) {
        setUser(res.user);
      }
      return { success: res.success, message: res.message };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  };

  // register
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await registerUser({ name, email, password });
      return { success: res.success, message: res.message };
    } catch {
      return { success: false, message: "Something went wrong" };
    }
  };

  // update profile
   const updateUser = async (name: string) => {
  try {
    const res = await updateProfile({ name });
    if (res.success) {
      setUser(res.user);
    }
    return { success: res.success, message: res.message };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};
  // logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch {
      setUser(null);
    }
  };
 
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-[#974FD0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
    }}>
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