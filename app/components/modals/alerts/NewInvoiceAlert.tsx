"use client";

import React, { useState } from "react";

// RHF
import { useFormContext } from "react-hook-form";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// ShadCn
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NewInvoiceAlertProps = {
    children: React.ReactNode;
};

const NewInvoiceAlert = ({ children }: NewInvoiceAlertProps) => {
    // Invoice context
    const { newInvoice } = useInvoiceContext();

    const {
        formState: { isDirty },
    } = useFormContext();

    const [open, setOpen] = useState(false);

    const handleNewInvoice = () => {
        if (isDirty) {
            // If the form is dirty, show the alert dialog
            setOpen(true);
        } else {
            // If the form is not dirty, call the newInvoice function from context
            newInvoice();
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            您确定要创建新发票吗？
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作无法撤消。如果您有未保存的更改，您可能会丢失数据。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            取消
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={newInvoice}>
                            创建新发票
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Not for showing div and instead showing the whole button */}
            {React.cloneElement(children as React.ReactElement, {
                onClick: handleNewInvoice,
            })}
        </>
    );
};

export default NewInvoiceAlert;
