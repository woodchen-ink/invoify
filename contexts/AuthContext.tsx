"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CZLUser, OAuthTokenResponse } from "@/types/electron";

const TOKEN_KEY = "czl_invoice:auth_token";
const USERINFO_KEY = "czl_invoice:auth_user";

interface AuthState {
  user: CZLUser | null;
  accessToken: string | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  accessToken: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function loadStored(): { token: OAuthTokenResponse | null; user: CZLUser | null } {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USERINFO_KEY);
    return { token: t ? JSON.parse(t) : null, user: u ? JSON.parse(u) : null };
  } catch {
    return { token: null, user: null };
  }
}

function isExpiringSoon(token: OAuthTokenResponse): boolean {
  // expires_in 是颁发时的秒数, 我们在 stored token 里写入 expiresAt 时间戳
  const stored = JSON.parse(localStorage.getItem(TOKEN_KEY) || "{}");
  if (!stored.expiresAt) return true;
  return Date.now() > stored.expiresAt - 5 * 60 * 1000; // 提前 5 分钟刷新
}

function saveToken(token: OAuthTokenResponse) {
  const withExpiry = { ...token, expiresAt: Date.now() + token.expires_in * 1000 };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(withExpiry));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CZLUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndStoreUser = useCallback(async (token: string) => {
    if (!window.electronAPI) return;
    const u = await window.electronAPI.getUserInfo(token);
    setUser(u);
    localStorage.setItem(USERINFO_KEY, JSON.stringify(u));
  }, []);

  // 启动时恢复登录态, 必要时刷新 token
  useEffect(() => {
    if (!window.electronAPI?.isDesktop) { setLoading(false); return; }

    (async () => {
      const { token, user: cachedUser } = loadStored();
      if (!token) { setLoading(false); return; }

      try {
        if (isExpiringSoon(token)) {
          const refreshed = await window.electronAPI!.refreshToken(token.refresh_token);
          saveToken(refreshed);
          setAccessToken(refreshed.access_token);
          await fetchAndStoreUser(refreshed.access_token);
        } else {
          setAccessToken(token.access_token);
          if (cachedUser) setUser(cachedUser);
          else await fetchAndStoreUser(token.access_token);
        }
      } catch {
        // 刷新失败, 清除登录态要求重新登录
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERINFO_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchAndStoreUser]);

  const login = useCallback(async () => {
    if (!window.electronAPI) return;
    const token = await window.electronAPI.login();
    saveToken(token);
    setAccessToken(token.access_token);
    await fetchAndStoreUser(token.access_token);
  }, [fetchAndStoreUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERINFO_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
