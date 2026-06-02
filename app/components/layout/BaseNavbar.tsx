"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "@/app/components";

const logoUrl = "https://i.czl.net/r2/img/2024/12/675829b6933fb.png";

const BaseNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="lg:container z-[99]">
            <nav>
                <div className="flex flex-wrap justify-between items-center px-5 py-2 gap-1 rounded-xl border bg-card shadow-sm">
                    {/* 品牌 + CZL Express 广告位 */}
                    <div className="flex flex-col items-center">
                        <Link href="https://exp.czl.net" target="_blank">
                            <img src={logoUrl} alt="CZL Express" width={100} height={50} style={{ height: "auto" }} loading="eager" />
                        </Link>
                        <Link className="text-xs mt-1 text-muted-foreground hover:underline" href="https://exp.czl.net" target="_blank">
                            CZL Express 官网
                        </Link>
                    </div>

                    {/* 应用标题 */}
                    <h1 className="text-2xl font-bold">CZL 发票</h1>

                    {/* 右侧: 语言 + 用户 */}
                    <div className="flex items-center gap-3">
                        <LanguageSelector />
                        {user && (
                            <div className="flex items-center gap-2">
                                {user.avatar && (
                                    <img src={user.avatar} alt={user.nickname} className="w-8 h-8 rounded-full object-cover" />
                                )}
                                <span className="text-sm text-muted-foreground">{user.nickname || user.username}</span>
                                <button
                                    onClick={logout}
                                    className="text-xs text-red-500 hover:underline"
                                >
                                    退出
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default BaseNavbar;
