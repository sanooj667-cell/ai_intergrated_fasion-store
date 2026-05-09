import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import api, { clearAuthTokens, setAuthTokens } from "../api/axios";

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function getStoredTokens() {
  return {
    access: localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const fetchProfile = useCallback(async () => {
    const { access } = getStoredTokens();
    if (!access) {
      setUser(null);
      return null;
    }

    try {
      const { data } = await api.get("/auth/profile/");
      setUser(data);
      return data;
    } catch (error) {
      setUser(null);
      return null;
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/login/", { email, password });
    setAuthTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user || null);
    return data.user;
  }, []);

  const register = useCallback(async ({ email, password, is_customer }) => {
    const { data } = await api.post("/auth/register/", { email, password, is_customer });
    setAuthTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user || null);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => fetchProfile(), [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const bootstrapAuth = async () => {
      await fetchProfile();
      if (mounted) setLoading(false);
    };

    bootstrapAuth();

    const onLogout = () => {
      clearAuthTokens();
      setUser(null);
    };

    const onTokenRefreshed = () => {
      fetchProfile();
    };

    window.addEventListener("auth:logout", onLogout);
    window.addEventListener("auth:token-refreshed", onTokenRefreshed);

    return () => {
      mounted = false;
      window.removeEventListener("auth:logout", onLogout);
      window.removeEventListener("auth:token-refreshed", onTokenRefreshed);
    };
  }, [fetchProfile]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProfile,
      fetchProfile,
    }),
    [user, loading, isAuthenticated, login, register, logout, refreshProfile, fetchProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
