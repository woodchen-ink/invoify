import { ReactNode } from "react";
import "@/app/globals.css";
import Script from "next/script";

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
    return (
        <>
            {children}
            <Script
                src="https://l.czl.net/script.js"
                data-website-id="a3cfc446-c48f-4b28-a772-a8839c18cd25"
                strategy="afterInteractive"
                async
            />
        </>
    );
}
