import { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
const logoUrl = "https://i.czl.net/r2/img/2024/12/675829b6933fb.png";

// ShadCn
import { Card } from "@/components/ui/card";

// Components
import { LanguageSelector } from "@/app/components";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <header className="lg:container z-[99]">
            <nav>
                <Card className="flex flex-wrap justify-between items-center px-5 py-2 gap-1">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Link href={"/"}>
                            <img
                                src={logoUrl}
                                alt="CZL Express Logo"
                                width={100}
                                height={50}
                                loading="eager"
                                style={{ height: "auto" }}
                        />
                        </Link>
                        <Link
                            className="text-sm mt-2"
                            href="https://exp.czl.net"
                            target="_blank">进入官网</Link>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-2xl font-bold">CZL Express 国际运输发票生成器</h1>

                    </div>
                    {/* ? DEV Only */}
                    {/* {devEnv && <DevDebug />} */}
                    <LanguageSelector />
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
