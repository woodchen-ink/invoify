"use client";

import { useState } from "react";

// ShadCn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Components
import { BaseButton } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { ExportTypes } from "@/types";

type InvoiceExportModalType = {
    children: React.ReactNode;
};

const InvoiceExportModal = ({ children }: InvoiceExportModalType) => {
    const [open, setOpen] = useState(false);

    const { invoicePdfLoading, exportInvoiceAs } = useInvoiceContext();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>导出发票</DialogTitle>
                    <DialogDescription>
                        请选择您的发票导出选项
                    </DialogDescription>
                </DialogHeader>

                {/* Export options here */}

                <div className="flex flex-wrap flex-row gap-5">
                    <BaseButton
                        tooltipLabel="导出为JSON"
                        variant="outline"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.JSON)}
                    >
                        导出为JSON
                    </BaseButton>
                    <BaseButton
                        tooltipLabel="导出为CSV"
                        variant="outline"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.CSV)}
                    >
                        导出为CSV
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="导出为XML"
                        variant="outline"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XML)}
                    >
                        导出为XML
                    </BaseButton>

                    <BaseButton
                        tooltipLabel="导出为XLSX"
                        variant="outline"
                        disabled={invoicePdfLoading}
                        onClick={() => exportInvoiceAs(ExportTypes.XLSX)}
                    >
                        导出为XLSX
                    </BaseButton>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceExportModal;
