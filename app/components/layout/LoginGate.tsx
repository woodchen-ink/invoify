"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";

// CZL Express 链接 (广告位)
const CZL_EXPRESS_URL = "https://exp.czl.net";
const CZL_LOGO_URL = "https://i.czl.net/r2/img/2024/12/675829b6933fb.png";

export default function LoginGate({ children }: { children: React.ReactNode }) {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-800">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-800 gap-8">
        <img src={CZL_LOGO_URL} alt="CZL Express" className="h-12 w-auto" />

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">CZL 发票</h1>
          <p className="text-slate-500 text-sm text-center">
            免费本地发票生成器，由{" "}
            <a href={CZL_EXPRESS_URL} target="_blank" className="text-blue-500 hover:underline">
              CZL Express
            </a>{" "}
            提供
          </p>
          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            使用 CZL Connect 登录
          </button>
          <p className="text-xs text-slate-400 text-center">
            登录后即可免费使用全部功能。账号由{" "}
            <a href="https://connect.czl.net" target="_blank" className="underline">
              CZL Connect
            </a>{" "}
            统一管理。
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Powered by{" "}
          <a href={CZL_EXPRESS_URL} target="_blank" className="hover:underline">
            CZL Express
          </a>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
