import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChange, signOut as firebaseSignOut, getCurrentUser } from "@/integrations/gcp/auth";
import { apiClient } from "@/integrations/gcp/api-client";
import type { UserRole } from "@/integrations/gcp/types";

interface AuthContextType {
  user: User | null;
  session: { user: User } | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setSession(firebaseUser ? { user: firebaseUser } : null);
      if (!firebaseUser) {
        setRole(null);
        setLoading(false);
        return;
      }
      apiClient.getAccountsMe().then((account) => {
        setRole(account.role);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    });

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSession({ user: currentUser });
      apiClient.getAccountsMe().then((account) => {
        setRole(account.role);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setSession(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
