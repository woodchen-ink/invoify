import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Fonts
import {
    alexBrush,
    dancingScript,
    greatVibes,
    outfit,
    parisienne,
} from "@/lib/fonts";

// Favicon
import Favicon from "@/public/assets/favicon/favicon.ico";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

// Next Intl
import { NextIntlClientProvider } from "next-intl";

// ShadCn
import { Toaster } from "@/components/ui/toaster";

// Components
import { BaseNavbar, BaseFooter } from "@/app/components";

// Contexts
import Providers from "@/contexts/Providers";

// SEO
import { JSONLD, ROOTKEYWORDS } from "@/lib/seo";

// Variables
import { BASE_URL, GOOGLE_SC_VERIFICATION, LOCALES } from "@/lib/variables";

export const metadata: Metadata = {
    title: "免费国际快递物流 PI&CI 运输发票在线生成器 | CZL Express",
    description:
        "CZL Express 提供免费的国际运输发票生成工具。轻松创建专业的物流单据，支持多种语言，适用于国际货运、快递和物流服务。简单快捷地生成标准化运输发票，提高您的业务效率。",
    icons: [{ rel: "icon", url: Favicon.src }],
    keywords: ROOTKEYWORDS,
    viewport: "width=device-width, initial-scale=1",
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: BASE_URL,
    },
    verification: {
        google: GOOGLE_SC_VERIFICATION,
    },
};

export function generateStaticParams() {
    const locales = LOCALES.map((locale) => locale.code);
    return locales;
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    let messages;
    try {
        messages = (await import(`@/i18n/locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <head>
                <script
                    type="application/ld+json"
                    id="json-ld"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
                />
            </head>
            <body
                className={`${outfit.className} ${dancingScript.variable} ${parisienne.variable} ${greatVibes.variable} ${alexBrush.variable} antialiased bg-slate-100 dark:bg-slate-800`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Providers>
                        <BaseNavbar />

                        <div className="flex flex-col">{children}</div>

                        <BaseFooter />

                        {/* Toast component */}
                        <Toaster />

                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
