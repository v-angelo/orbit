"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { getCurrentUser, logout, type AuthUser } from "@/services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isSigningOut: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser: AuthUser;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Refresh the current user's information
  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    const currentUser = await getCurrentUser();

    setUser(currentUser);

    return currentUser;
  }, []);

  // Log out the current user
  const signOut = useCallback(async (): Promise<void> => {
    setIsSigningOut(true);

    try {
      await logout();
      setUser(null);
    } finally {
      setIsSigningOut(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isSigningOut,
      isAuthenticated: !!user,
      setUser,
      refreshUser,
      signOut,
    }),
    [user, isLoading, isSigningOut, refreshUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Access authentication state from components
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
