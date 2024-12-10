"use client";

// ShadCn
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Components
import { BaseButton, SendPdfToEmailModal, Subheading } from "@/app/components";

// Contexts
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Icons
import {
    BookmarkIcon,
    DownloadCloudIcon,
    Eye,
    Mail,
    MoveLeft,
    Printer,
} from "lucide-react";

export default function FinalPdf() {
    const {
        pdfUrl,
        removeFinalPdf,
        previewPdfInTab,
        downloadPdf,
        printPdf,
        saveInvoice,
        sendPdfToMail,
    } = useInvoiceContext();

    return (
        <>
            <Subheading>最终PDF:</Subheading>
            <div className="flex items-center mb-3">
                <BaseButton
                    variant={"ghost"}
                    size="sm"
                    onClick={removeFinalPdf}
                >
                    <MoveLeft className="w-5 h-5" />
                    返回实时预览
                </BaseButton>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 my-1">
                <BaseButton
                    tooltipLabel="在新标签页中预览发票"
                    onClick={previewPdfInTab}
                    size="sm"
                    variant={"outline"}
                >
                    <Eye className="w-5 h-5" />
                    预览
                </BaseButton>
                <BaseButton
                    tooltipLabel="下载发票PDF"
                    onClick={downloadPdf}
                    size="sm"
                    variant={"outline"}
                >
                    <DownloadCloudIcon className="w-5 h-5" />
                    下载
                </BaseButton>

                <BaseButton
                    tooltipLabel="打印发票"
                    onClick={printPdf}
                    size="sm"
                    variant={"outline"}
                >
                    <Printer className="w-5 h-5" />
                    打印
                </BaseButton>

                <BaseButton
                    tooltipLabel="保存发票到网站"
                    onClick={saveInvoice}
                    size="sm"
                    variant={"outline"}
                >
                    <BookmarkIcon className="w-5 h-5" />
                    保存
                </BaseButton>

                <SendPdfToEmailModal sendPdfToMail={sendPdfToMail}>
                    <BaseButton
                        tooltipLabel="发送发票PDF到邮箱"
                        size="sm"
                        variant={"outline"}
                    >
                        <Mail className="w-5 h-5" />
                        发送到邮箱
                    </BaseButton>
                </SendPdfToEmailModal>
            </div>
            <AspectRatio ratio={1 / 1.4}>
                <iframe
                    className="h-full w-full rounded-xl"
                    src={`${pdfUrl}#toolbar=0`}
                />
            </AspectRatio>
        </>
    );
}
