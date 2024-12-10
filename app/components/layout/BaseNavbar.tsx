import { useMemo } from "react";

// Next
import Link from "next/link";
import Image from "next/image";

// Assets
const logoUrl = "https://i.czl.net/r2/2023/06/20/6491692758187.png";

// ShadCn
import { Card } from "@/components/ui/card";

// Components
import { LanguageSelector, ThemeSwitcher } from "@/app/components";

const BaseNavbar = () => {
    const devEnv = useMemo(() => {
        return process.env.NODE_ENV === "development";
    }, []);

    return (
        <header className="lg:container z-[99]">
            <nav>
                <Card className="flex flex-wrap justify-between items-center px-5 gap-1">
                    <Link href={"/"}>
                        <img
                            src={logoUrl}
                            alt="CZL Express Logo"
                            width={100}
                            height={100}
                            loading="eager"
                        />
                    </Link>
                    <div className="flex flex-row items-center gap-2">
                        <h1 className="text-2xl font-bold">CZL Express 国际运输发票生成器</h1>
                    </div>
                    {/* ? DEV Only */}
                    {/* {devEnv && <DevDebug />} */}
                    <LanguageSelector />
                    <ThemeSwitcher />
                </Card>
            </nav>
        </header>
    );
};

export default BaseNavbar;
