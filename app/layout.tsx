"use client";

import { ReactNode, useEffect } from "react";
import "@/app/globals.css";

type Props = {
    children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://analytics.czl.net/script.js";
        script.defer = true;
        script.dataset.websiteId = "39809dd9-8cbb-441a-b48f-3bcfa50cb1c4";
        
        document.head.appendChild(script);
        
        // Cleanup function to remove the script when component unmounts
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return children;
}
