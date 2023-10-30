"use client";

import React from "react";

// ShadCn
import { Label } from "@/components/ui/label";

// Components
import {
    CurrencySelector,
    DatePickerFormField,
    FormInput,
    FormLogoInput,
} from "@/app/components";

type InvoiceDetailsProps = {};

const InvoiceDetails = ({}: InvoiceDetailsProps) => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <Label
                    htmlFor="invoiceDetails"
                    className="text-xl font-semibold"
                >
                    Invoice Details:
                </Label>
                <FormLogoInput
                    name="details.invoiceLogo"
                    label="Invoice Logo"
                />

                <FormInput
                    name="details.invoiceNumber"
                    label="Invoice number"
                    placeholder="Invoice number"
                />

                <DatePickerFormField
                    name="details.invoiceDate"
                    label="Issued date"
                />

                <DatePickerFormField name="details.dueDate" label="Due date" />

                <CurrencySelector
                    name="details.currency"
                    label="Currency"
                    placeholder="Select Currency"
                />
            </div>
        </>
    );
};

export default InvoiceDetails;
