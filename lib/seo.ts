import { BASE_URL } from "@/lib/variables";

export const ROOTKEYWORDS = [
    "invoice",
    "invoice generator",
    "invoice generating",
    "invoice app",
    "invoice generator app",
    "free invoice generator",
];

export const JSONLD = {
    "@context": "https://schema.org",
    "@type": "Website",
    name: "免费国际快递物流 PI&CI 运输发票在线生成器 | CZL Express",
    description: "CZL Express 提供免费的国际运输发票生成工具。轻松创建专业的物流单据，支持多种语言，适用于国际货运、快递和物流服务。简单快捷地生成标准化运输发票，提高您的业务效率。",
    keywords: ROOTKEYWORDS,
    url: BASE_URL,
    image: "https://i.czl.net/r2/2023/06/20/649169283f20c.png",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#website`,
    },
    
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            url: `${BASE_URL}`,
        },
    ],
};
