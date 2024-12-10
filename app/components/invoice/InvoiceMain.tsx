"use client";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import { Form } from "@/components/ui/form";

// Components
import { InvoiceActions, InvoiceForm } from "@/app/components";

// Context
import { useInvoiceContext } from "@/contexts/InvoiceContext";

// Types
import { InvoiceType } from "@/types";

const InvoiceMain = () => {
    const { handleSubmit, getValues } = useFormContext<InvoiceType>();

    // Get the needed values from invoice context
    const { onFormSubmit } = useInvoiceContext();

    return (
        <>
            <Form {...useFormContext<InvoiceType>()}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = getValues();
                        onFormSubmit(formData);
                    }}
                >
                    <div className="flex flex-wrap">
                        <InvoiceForm />
                        <InvoiceActions />
                    </div>
                </form>
            </Form>
        </>
    );
};

export default InvoiceMain;
