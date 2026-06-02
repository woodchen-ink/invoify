import { NextRequest, NextResponse } from "next/server";

// Helpers
import { getInvoiceTemplate } from "@/lib/helpers";

// Variables
import { TAILWIND_CDN } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

/**
 * 渲染发票模板为完整 HTML 文档字符串。
 *
 * 桌面版不再用 Puppeteer 启浏览器, 而是把渲染好的 HTML 交给 Electron 主进程
 * 的隐藏窗口 printToPDF。本服务只负责: 模板 React -> 静态 HTML -> 内联样式表链接,
 * 输出一个可独立加载的完整页面。
 *
 * @param {NextRequest} req - Next.js 请求对象, body 为发票数据。
 * @returns {Promise<NextResponse>} 返回 text/html 响应。
 */
export async function generatePdfService(req: NextRequest) {
    const body: InvoiceType = await req.json();

    try {
        const ReactDOMServer = (await import("react-dom/server")).default;
        const templateId = body.details.pdfTemplate;
        const InvoiceTemplate = await getInvoiceTemplate(templateId);

        if (!InvoiceTemplate) {
            throw new Error(`Invoice template ${templateId} not found`);
        }

        const bodyMarkup = ReactDOMServer.renderToStaticMarkup(
            InvoiceTemplate(body)
        );

        // 组装成完整 HTML 文档, 由 Electron printToPDF 渲染
        const htmlDocument = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="${TAILWIND_CDN}" />
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; }
</style>
</head>
<body>${bodyMarkup}</body>
</html>`;

        return new NextResponse(htmlDocument, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
            },
            status: 200,
        });
    } catch (error: any) {
        console.error("PDF HTML Generation Error:", error);
        return new NextResponse(
            JSON.stringify({ error: "Failed to render invoice HTML" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
